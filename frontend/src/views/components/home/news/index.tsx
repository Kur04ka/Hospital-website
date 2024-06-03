import React, { useEffect } from 'react';
import { ListItemAvatar, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Container } from '@mui/material';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import styles from './news.module.css';
import { useNewsStore } from '../../../../data/news/newsStore';
import { formatDate } from '../../../../utils/date_parser'
import Carousel from 'react-material-ui-carousel'

interface News {
    id: number;
    title: string;
    short_body: string;
    full_body: string;
    publication_date: string;
}

const NewsComponent: React.FC = () => {
    const { news, fetchNews } = useNewsStore();

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const groupedNews = groupNewsInPairs(news);

    return (
        <div className={styles.main}>
            <Typography variant="h4" sx={{ color: 'rgba(8, 44, 77, 1)', fontFamily: 'Gilroy Bold', marginBottom: 3, textAlign: 'center' }}>Новости</Typography>

            <Carousel>
                    {groupedNews.map((pair, index) => (

                        <Container key={index} className={styles.news__container}>
                            {pair.map(item => (
                                <Container key={item.id} className={styles.piece_of_news}>
                                    <img src="./images/news.png" height={230} />
                                    <div className={styles.body}>
                                        <Typography gutterBottom variant="subtitle1" sx={{ color: 'rgba(137, 155, 181, 1)' }}>{formatDate(item.publication_date)}</Typography>
                                        <Typography gutterBottom variant="h5" sx={{ color: 'rgba(8, 44, 77, 1)', fontFamily: 'Gilroy Bold' }}>{item.title}</Typography>
                                        <Typography gutterBottom variant="subtitle1" sx={{ color: 'rgba(137, 155, 181, 1)', fontFamily: 'Gilroy Medium' }}>{item.short_body}</Typography>

                                    </div>
                                    <NavLink to="/page-not-found" color="inherit">
                                        <Button className={styles.button} variant="contained">Читать полностью</Button>
                                    </NavLink>
                                </Container>
                            ))}
                        </Container>

                    ))}
                </Carousel>
        </div>
    );
};

function groupNewsInPairs(news: News[]): News[][] {
    const pairs: News[][] = [];
    for (let i = 0; i < news.length; i += 2) {
        pairs.push(news.slice(i, i + 2));
    }
    return pairs;
}

export default NewsComponent;