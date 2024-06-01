import  styles  from './womanWithHeart.module.css';
import React from 'react';


const WomenWithHeart: React.FC = (): JSX.Element => {

    return (
        <div className={styles.container}>
            <img src="woman-showing-heart.png" alt="woman showing heart" className='woman__img'  height={700}/>
        </div>
    );
}

export default WomenWithHeart;