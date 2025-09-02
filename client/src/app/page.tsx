import Image from 'next/image'
import Carousel from '../components/Carousel'
import ProductList from '../components/ProductList';


const Homepage = async({searchParams}:{searchParams:Promise<{category:String}>}) => {

  const images = [
  '/featured.png',
  '/smartWatch.jpg',
  '/laptop.jpg',
];

const category = (await searchParams).category;
  return (
    <div className=''>
      <div className="w-[95%] mx-auto my-2">
        <Carousel images={images} autoSlide autoSlideInterval={3000} />
        <ProductList category={category} params={"homepage"}
        />
      </div>
    </div>
  )
}

export default Homepage