"use client";

import Link from "next/link";
import Image from "next/image";
import '@/styles/navbar.css';


export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/compte">
        <Image src="/images/Internal/account-icon.png" alt="Compte" width={50} height={50} className="image" />
      </Link>
      <Link href="/">
        <Image src="/images/Internal/car-icon.png" alt="Accueil" width={50} height={50} className="image" />
      </Link>
      <Link href="/panier">
        <Image src="/images/Internal/cart-icon.png" alt="Panier" width={50} height={50} className="image" />
      </Link>
    </nav>
  );
}
