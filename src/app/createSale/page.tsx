"use client";

import Navbar from '@/components/navbar';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../actions/isAuthenticated";
import { isSalor } from "../../../actions/isSalor";
import { getCars } from '../../../actions/getCars';
import { deleteCar } from '../../../actions/deleteCar';
import { imagesSaver } from "../../../actions/imagesSaver";
import { updateCar } from '../../../actions/updateCar'; // Nous aurons besoin de créer cette action
import deleteFolder from '../../../actions/deleteFolder';
import "@/styles/carForms.css";

// Type pour la voiture
type Voiture = {
  id: string;
  prix: number | null;
  modele: string;
  marque: string;
  imgVoiture: string | null;
  kilometrage: number | null;
  annee: number | null;
  carburant: string | null;
  Transmission: string | null;
  Puissance: number | null;
};

export default function CreateSaleButton() {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [salor, setSalor] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const [cars, setCars] = useState<Voiture[]>([]);
    const [loadingCars, setLoadingCars] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCar, setCurrentCar] = useState<Voiture | null>(null);
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        isAuthenticated().then((result) => {
            setAuthenticated(result);
        });
    }, []);

    useEffect(() => {
        isSalor().then((result) => {
            setSalor(result);
        });
    }, []);

    useEffect(() => {
        if (authenticated && salor) {
            fetchCars();
        }
    }, [authenticated, salor]);

    // Remplir le formulaire avec les données de la voiture à modifier
    useEffect(() => {
        if (currentCar && formRef.current) {
            const form = formRef.current;
            form.marque.value = currentCar.marque || '';
            form.modele.value = currentCar.modele || '';
            form.prix.value = currentCar.prix || '';
            form.kilometrage.value = currentCar.kilometrage || '';
            form.annee.value = currentCar.annee || '';
            form.carburant.value = currentCar.carburant || '';
            form.Transmission.value = currentCar.Transmission || '';
            form.Puissance.value = currentCar.Puissance || '';
            
            // Charger l'aperçu de l'image existante
            if (currentCar.id) {
                setPreviewImage(`/images/car-image/${currentCar.id}/image.png`);
            }
        }
    }, [currentCar]);

    const fetchCars = async () => {
        setLoadingCars(true);
        try {
            const result = await getCars();
            if (result.success) {
                setCars(result.cars);
            } else {
                console.error("Erreur:", result.error);
            }
        } catch (error) {
            console.error("Erreur de chargement des voitures:", error);
        } finally {
            setLoadingCars(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleFile = (file: File | undefined) => {
        if (!file) return;
        
        // Vérifier si le fichier est un PNG
        if (file.type !== "image/png") {
            setMessage({ type: "error", content: "Seuls les fichiers PNG sont acceptés" });
            return;
        }

        // Limite de taille (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: "error", content: "L'image ne doit pas dépasser 5MB" });
            return;
        }

        // Créer un aperçu de l'image
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleEdit = (car: Voiture) => {
        setCurrentCar(car);
        setEditMode(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleCancelEdit = () => {
        setCurrentCar(null);
        setEditMode(false);
        setPreviewImage(null);
        if (formRef.current) formRef.current.reset();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", content: "" });

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);
            
            if (editMode && currentCar) {
                formData.append('id', currentCar.id);
            }
            
            // Récupérer l'image depuis le fileInput
            const fileInput = fileInputRef.current;
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                formData.set('carImage', fileInput.files[0]);
            } else if (!previewImage && !editMode) {
                // Pour une nouvelle voiture, l'image est requise
                setMessage({ type: "error", content: "Veuillez ajouter une image de la voiture" });
                setLoading(false);
                return;
            }
            
            let result;
            
            if (editMode && currentCar) {
                // Appeler la fonction de mise à jour
                result = await updateCar(formData);
                window.location.reload();
            } else {
                // Appeler la fonction d'ajout
                result = await imagesSaver(formData);
            }

            if (result.success) {
                const message = editMode ? "Voiture mise à jour avec succès!" : "Voiture ajoutée avec succès!";
                setMessage({ type: "success", content: message });
                
                // Réinitialiser le formulaire
                setPreviewImage(null);
                if (form) form.reset();
                
                // Sortir du mode édition
                if (editMode) {
                    setEditMode(false);
                    setCurrentCar(null);
                }
                
                // Actualiser la liste des voitures
                fetchCars();
                
            } else {
                setMessage({ type: "error", content: `Erreur: ${result.error}` });
            }
        } catch (error) {
            const action = editMode ? "la mise à jour" : "l'ajout";
            setMessage({ type: "error", content: `Erreur lors de ${action} de la voiture` });
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id: string, marque: string, modele: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la ${marque} - ${modele} ?`)) {
            await deleteCar(id);
            await deleteFolder(`public/images/car-image/${id}/`);
            fetchCars();
            
        }
    };

    if (authenticated === null || salor === null) {
        return <div className="loading-container"><div className="loading-spinner"></div></div>;
    }

    if (!authenticated) {
        router.push("/");
        return null;
    }

    if (!salor) {
        return <div className="error-message">Vous n'êtes pas autorisé à accéder à cette page</div>;
    }

    return (
        <div className="car-catalogue-container">
            <Navbar/>
            <div className="catalogue-header">
                <h1>Gestion du catalogue des voitures</h1>
            </div>
            
            <div className="catalogue-content">
                <div className="form-section">
                    <div className="form-header">
                        <h2>{editMode ? "Modifier une voiture" : "Ajouter une nouvelle voiture"}</h2>
                    </div>
                    
                    {message.content && (
                        <div className={`message-box ${message.type === "success" ? "success" : "error"}`}>
                            {message.content}
                        </div>
                    )}
                    
                    <form ref={formRef} onSubmit={handleSubmit} className="car-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Marque</label>
                                <input type="text" name="marque" required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Modèle</label>
                                <input type="text" name="modele" required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Prix (€)</label>
                                <input type="number" name="prix" step="0.01" min="0" required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Kilométrage</label>
                                <input type="number" name="kilometrage" required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Année</label>
                                <input type="number" name="annee" required/>
                            </div>
                            
                            <div className="form-group">
                                <label>Carburant</label>
                                <select required name="carburant">
                                    <option value="">Sélectionner</option>
                                    <option value="Essence">Essence</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Hybride">Hybride</option>
                                    <option value="Électrique">Électrique</option>
                                    <option value="GPL">GPL</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Transmission</label>
                                <select required name="Transmission">
                                    <option value="">Sélectionner</option>
                                    <option value="Manuelle">Manuelle</option>
                                    <option value="Automatique">Automatique</option>
                                    <option value="Semi-automatique">Semi-automatique</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Puissance (ch)</label>
                                <input type="number" name="Puissance" min="0" required/>
                            </div>
                        </div>
                        
                        <div className="form-group full-width">
                            <label>
                                {editMode 
                                    ? "Image de la voiture (PNG uniquement, laisser vide pour conserver l'image existante)" 
                                    : "Image de la voiture (PNG uniquement)"}
                            </label>
                            <div className={`image-drop-area ${isDragging ? 'dragging' : ''} ${previewImage ? 'has-image' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                                {previewImage ? (
                                    <div className="preview-container">
                                        <img src={previewImage} alt="Aperçu" className="image-preview" />
                                        <button type="button" className="remove-image" onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewImage(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                                            <rect x="16" y="2" width="6" height="6" rx="1"></rect>
                                            <path d="M9 10h.01M9 16l3-3 3 3"></path>
                                        </svg>
                                        <p>Glissez-déposez votre image ici ou cliquez pour sélectionner</p>
                                        <span className="file-info">PNG uniquement, 5MB max</span>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} accept=".png" onChange={handleImageChange}style={{ display: 'none' }} required={!editMode}/>
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            {editMode && (
                                <button type="button" onClick={handleCancelEdit} className="btn-cancel">Annuler</button>
                            )}
                            <button type="submit" disabled={loading} className={loading ? "btn-loading" : ""}>
                                {loading ? "Enregistrement..." : (editMode ? "Mettre à jour" : "Ajouter au catalogue")}
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="cars-section">
                    <div className="section-header">
                        <h2>Catalogue des voitures</h2>
                    </div>
                    
                    {loadingCars ? ( <div className="loading-container"><div className="loading-spinner"></div></div>) : cars.length === 0 ? (
                        <div className="empty-catalogue">Aucune voiture dans le catalogue pour le moment.</div>
                    ) : (
                        <div className="table-container">
                            <table className="cars-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Marque</th>
                                        <th>Modèle</th>
                                        <th className="text-right">Prix</th>
                                        <th>Année</th>
                                        <th>Kilométrage</th>
                                        <th>Carburant</th>
                                        <th>Transmission</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cars.map((car) => (
                                        <tr key={car.id}>
                                            <td className="car-image-cell">
                                                <img src={`/images/car-image/${car.id}/image.png`} alt={`${car.marque} - ${car.modele}`}/>
                                            </td>
                                            <td>{car.marque}</td>
                                            <td>{car.modele}</td>
                                            <td className="text-right">{car.prix ? `${car.prix.toLocaleString()} €` : '-'}</td>
                                            <td>{car.annee || '-'}</td>
                                            <td>{car.kilometrage ? `${car.kilometrage.toLocaleString()} km` : '-'}</td>
                                            <td>{car.carburant || '-'}</td>
                                            <td>{car.Transmission || '-'}</td>
                                            <td className="action-buttons">
                                                <button className="btn-details" onClick={() => {router.push(`/cars/car/${car.id}`);}}>Détails</button>
                                                <button className="btn-edit" onClick={() => handleEdit(car)}>Modifier</button>
                                                <button className="btn-delete" onClick={() => handleDelete(car.id, car.marque, car.modele)}>Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}