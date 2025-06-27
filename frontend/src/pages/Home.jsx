import React from 'react'
import Carouselcomp from '../components/Carousel'
import Category from '../components/CategoryList'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import BackToTopButton from '../components/BackToTopButton';

function Home() {
  return (
    <div className='mt-20 lg:mt-24 mx-4'>
    <Carouselcomp/>
    <Category/>
    <HorizontalCardProduct category="Mouse" heading="Top Rated Mouses"/>
    <HorizontalCardProduct category="earphones" heading="Top Rated Earphones"/>
    <VerticalCardProduct category="mobiles" heading="Top Rated Mobiles"/>
    <VerticalCardProduct category="refrigerator" heading="Top Rated Refrigerators"/>
    <VerticalCardProduct category="printers" heading="Printers"/>
    <VerticalCardProduct category="televisions" heading="Televisions"/>
    <VerticalCardProduct category="trimmers" heading="Trimmers"/>
    <VerticalCardProduct category="watches" heading="Watches"/>
    <VerticalCardProduct category="camera" heading="Cameras"/>
    <BackToTopButton />
    </div>
  )
}

export default Home