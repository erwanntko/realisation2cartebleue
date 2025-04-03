import React from 'react';
import Link from 'next/link';
import styles from '@/styles/createSale.module.css';

const CreateSaleButton: React.FC = () => {
  return (
    <Link href="/createSale" className={styles.buttonContainer}>
      <div className={styles.roundButton}>
        <span className={styles.plusSign}>+</span>
      </div>
    </Link>
  );
};

export default CreateSaleButton;