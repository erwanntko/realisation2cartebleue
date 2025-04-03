"use client";

import Navbar from "@/components/navbar";
import { createUser } from "../../../actions/createUser";
import { validateUser } from "../../../actions/validateUser";
import styles from '@/styles/logister.module.css';

export default function Logister() {    

    // Fonction regex pour la connexion + connexion
    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        const username = (form.loginUsername.value as string).trim();
        const password = (form.loginPassword.value as string).trim();
        
        let hasError = false;
      
        // Réinitialisation de l'affichage des erreurs
        document.getElementById("errorEmptyLoginUsername")!.style.display = "none";
        document.getElementById("errorLenLoginUsername")!.style.display = "none";
        document.getElementById("errorEmptyLoginPassword")!.style.display = "none";
        document.getElementById("errorLenLoginPassword")!.style.display = "none";
        document.getElementById("errorMajLoginPassword")!.style.display = "none";
        document.getElementById("errorNumberLoginPassword")!.style.display = "none";
        document.getElementById("errorSpecialCharLoginPassword")!.style.display = "none";
      
        // Vérification du username
        if (username === "") {
          document.getElementById("errorEmptyLoginUsername")!.style.display = "block";
          hasError = true;
        }
      
        if (username.length < 6 || username.length > 18) {
          document.getElementById("errorLenLoginUsername")!.style.display = "block";
          hasError = true;
        }
      
        // Vérification du mot de passe
        if (password === "") {
          document.getElementById("errorEmptyLoginPassword")!.style.display = "block";
          hasError = true;
        }
      
        if (password.length < 8) {
          document.getElementById("errorLenLoginPassword")!.style.display = "block";
          hasError = true;
        }
      
        if (!/[A-Z]/.test(password)) {
          document.getElementById("errorMajLoginPassword")!.style.display = "block";
          hasError = true;
        }
      
        if (!/\d/.test(password)) {
          document.getElementById("errorNumberLoginPassword")!.style.display = "block";
          hasError = true;
        }
      
        if (!/[#?!@$%^&*-]/.test(password)) {
          document.getElementById("errorSpecialCharLoginPassword")!.style.display = "block";
          hasError = true;
        }
      
        if (hasError) {
          return;
        }

        const result = await validateUser(username, password);
            
        if (result.error) {
            document.getElementById("loginErrorMessage").style.display = "block";
        }

        // Vide les formulaires pour éviter au moins un tout petit peu le brut force
        form.loginUsername.value = "";
        form.loginPassword.value = "";
    };
      
    // Fonction regex pour l'inscription
    const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        const username = (form.registerUsername.value as string).trim();
        const password = (form.registerPassword.value as string).trim();
        const firstName = (form.registerFirstName.value as string).trim();
        const lastName = (form.registerLastName.value as string).trim();
        const phoneNumber = (form.registerPhoneNumber.value as string).trim();
        const address = (form.registerAddress.value as string).trim();
        const postalCode = (form.registerPostalCode.value as string).trim();

        let hasError = false; // Réinitialise l'erreur à chaque soumission
      
        // Réinitialisation de l'affichage des erreurs
        document.getElementById("errorEmptyRegisterUsername")!.style.display = "none";
        document.getElementById("errorLenRegisterUsername")!.style.display = "none";
        document.getElementById("errorEmptyRegisterPassword")!.style.display = "none";
        document.getElementById("errorLenRegisterPassword")!.style.display = "none";
        document.getElementById("errorNumberRegisterPassword")!.style.display = "none";
        document.getElementById("errorSpecialCharRegisterPassword")!.style.display = "none";
        document.getElementById("errorMajRegisterPassword")!.style.display = "none";
        document.getElementById("errorEmptyRegisterFirstName")!.style.display = "none";
        document.getElementById("errorRegisterFirstName")!.style.display = "none";
        document.getElementById("errorEmptyRegisterLastName")!.style.display = "none";
        document.getElementById("errorRegisterLastName")!.style.display = "none";
        document.getElementById("errorEmptyRegisterPhoneNumber")!.style.display = "none";
        document.getElementById("errorRegisterPhoneNumber")!.style.display = "none";
        document.getElementById("errorEmptyRegisterAddress")!.style.display = "none";
        document.getElementById("errorEmptyRegisterPostalCode")!.style.display = "none";
        document.getElementById("errorRegisterPostalCode")!.style.display = "none";  
      
        // Vérification du username
        if (username === "") {
            document.getElementById("errorEmptyRegisterUsername")!.style.display = "block";
            return false;
        }
    
        if (username.length < 6 || username.length > 18) {
            document.getElementById("errorLenRegisterUsername")!.style.display = "block";
            return false;
        }
    
        if (password === "") {
            document.getElementById("errorEmptyRegisterPassword")!.style.display = "block";
            return false;
        }
    
        if (password.length < 8) {
           document.getElementById("errorLenRegisterPassword")!.style.display = "block";
            return false;
        }
    
        if (!/\d/.test(password)) {
            document.getElementById("errorNumberRegisterPassword")!.style.display = "block";
            return false;
        }
        
         
        if (!/[#?!@$%^&*-]/.test(password)) {
            document.getElementById("errorSpecialCharRegisterPassword")!.style.display = "block";
            return false;
        }
        
         
        if (!/[A-Z]/.test(password)) {
            document.getElementById("errorMajRegisterPassword")!.style.display = "block";
            return false;
        }
    
        if (firstName === "") {
            document.getElementById("errorEmptyRegisterFirstName")!.style.display = "block";
            return false;
        }
    
        if(!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{1,50}$/.test(firstName)) {
            document.getElementById("errorRegisterFirstName")!.style.display = "block";
            return false;
        }
    
        if (lastName.trim() === "") {
            document.getElementById("errorEmptyRegisterLastName")!.style.display = "block";
            return false;
        }
    
        if(!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{1,50}$/.test(lastName)) {
            document.getElementById("errorRegisterLastName")!.style.display = "block";
            return false;
        }
    
        if (phoneNumber.trim() === "") {
            document.getElementById("errorEmptyRegisterPhoneNumber")!.style.display = "block";
            return false;
        }
    
        if(!/^0\d(\s\d{2}){4}$/.test(phoneNumber)) {
            document.getElementById("errorRegisterPhoneNumber")!.style.display = "block";
            return false;
        }
    
        if (address.trim() === "") {
            document.getElementById("errorEmptyRegisterAddress")!.style.display = "block";
            return false;
        }
    
        if (postalCode.trim() === "") {
            document.getElementById("errorEmptyRegisterPostalCode")!.style.display = "block";
            return false;
        }
    
        if(!/^((0[1-9])|([1-8][0-9])|(9[0-5])|(2[abAB]))[0-9]{3}$/.test(postalCode)) {
            document.getElementById("errorRegisterPostalCode")!.style.display = "block";
            return false;
        }

        if (hasError) {
            return;
        }


        await createUser(username, password, firstName, lastName, phoneNumber, address, postalCode);
        window.location.reload();
      };
      
    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.midSlice}>
                    <div className={styles.box}>
                        <h1>Créer un compte</h1>
                        <form onSubmit={handleSubmitRegister}>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerUsername">Pseudo :</label>
                                <input type="text" id="registerUsername" name="registerUsername"/>
                                <p id="errorEmptyRegisterUsername" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                <p id="errorLenRegisterUsername" className={styles.error}>* Le nom d'utilisateur doit faire entre 6 et 18 charactères. *</p>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerPassword">Mot de passe :</label>
                                <input type="password" id="registerPassword" name="registerPassword"/>
                                <p id="errorEmptyRegisterPassword" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                <p id="errorLenRegisterPassword" className={styles.error}>* Il doit faire au moins 8 charactères. *</p>
                                <p id="errorNumberRegisterPassword" className={styles.error}>* Il doit contenir un chiffre. *</p>
                                <p id="errorSpecialCharRegisterPassword" className={styles.error}>* Il doit contenir un charactères spéciales. *</p>
                                <p id="errorMajRegisterPassword" className={styles.error}>* Il doit contenir une majuscule. *</p>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerFirstName">Prénom :</label>
                                <input type="text" id="registerFirstName" name="registerFirstName"/>
                                <p id="errorEmptyRegisterFirstName" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                <p id="errorRegisterFirstName" className={styles.error}>* Votre prénom n'est pas conforme. *</p>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerLastName">Nom :</label>
                                <input type="text" id="registerLastName" name="registerLastName"/>
                                <p id="errorEmptyRegisterLastName" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                <p id="errorRegisterLastName" className={styles.error}>* Votre nom de famille n'est pas conforme. *</p>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerPhoneNumber">Téléphone :</label>
                                <input type="text" id="registerPhoneNumber" name="registerPhoneNumber"/>
                                <p id="errorEmptyRegisterPhoneNumber" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                <p id="errorRegisterPhoneNumber" className={styles.error}>* Votre numéro de téléphone n'est pas conforme. *</p>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerAddress">Adresse :</label>
                                <input type="text" id="registerAddress" name="registerAddress"/>
                                <p id="errorEmptyRegisterAddress" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="registerPostalCode">Code postal :</label>
                                <input type="text" id="registerPostalCode" name="registerPostalCode"/>
                                <p id="errorEmptyRegisterPostalCode" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                <p id="errorRegisterPostalCode" className={styles.error}>* Votre code postal n'est pas conforme. *</p>
                            </div>

                            <button type="submit" className={styles.btn}>Créer un compte</button>
                        </form>
                    </div>
                </div>

                <div className={styles.midSlice}>
                    <section className={styles.loginSection}>
                        <div className={styles.box}>                    
                            <h1>Qui êtes-vous?</h1>
                            <form onSubmit={handleSubmitLogin}>
                            
                                <div className={styles.inputBox}>
                                    <label htmlFor="loginUsername">Nom d'utilisateur :</label>
                                    <input type="text" id="loginUsername" name="loginUsername"/>
                                    <p id="errorEmptyLoginUsername" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                    <p id="errorLenLoginUsername" className={styles.error}>* Le nom d'utilisateur doit faire entre 6 et 18 charactères. *</p>
                                </div>

                                <div className={styles.inputBox}>
                                    <label htmlFor="loginPassword">Mot de passe :</label>
                                    <input type="password" id="loginPassword" name="loginPassword"/>
                                    <p id="errorEmptyLoginPassword" className={styles.error}>* Ce champ ne peut pas être vide. *</p>
                                    <p id="errorLenLoginPassword" className={styles.error}>* Il doit être compris entre 8 et 16 charactères. *</p>
                                    <p id="errorNumberLoginPassword" className={styles.error}>* Il doit contenir un chiffre. *</p>
                                    <p id="errorSpecialCharLoginPassword" className={styles.error}>* Il doit contenir un charactères spéciales. *</p>
                                    <p id="errorMajLoginPassword" className={styles.error}>* Il doit contenir une majuscule. *</p>
                                </div>

                                <div className={styles.souvenir}>
                                    <div className={styles.divInputBoxSouvenir}>
                                        <input type="checkbox" className={styles.inputBoxSouvenir}/>
                                        <label htmlFor="souvenir">Se souvenir de moi</label>
                                    </div>
                                </div>

                                <button type="submit" className={styles.btn}>Valider</button>
                            </form>
                            <div className={styles.inputBox}>
                                <p id="loginErrorMessage" className={styles.error}>* Les identifiants renseignés sont incorrects ! *</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}