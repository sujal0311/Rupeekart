import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CategoryCard({ item }) {
  return (
    <Card sx={{ 
      maxWidth: {
        xs: '90vw', // 90% of viewport width for extra small screens
        sm: 280,    // 280px for small and up screens
      },
      margin: 'auto', // center the card
      mt: 2 // top margin for spacing
    }}>
      <CardMedia
        sx={{
          height: {
            xs: '25vh', // 25% of viewport height for extra small screens
            md: 200    // 140px for medium and up screens
          },
          width: {
            xs: '90vw', // 90% of viewport width for extra small screens
            sm: '100%'  // 100% width for small and up screens
            ,md:'30vw'
          },
          objectFit: 'cover' // ensures the image covers the area
        }}
        image={item.image}
      />
      <CardContent>
        <div className='flex justify-center'><Typography variant="body1" component="div">
          {item.title}
        </Typography></div>
      </CardContent>
    </Card>
  );
}
