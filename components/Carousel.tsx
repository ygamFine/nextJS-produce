'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export function Carousel() {
  const slides = [
    {
      id: 1,
      image: '/images/banner1.jpg',
      title: '创新科技',
    },
    {
      id: 2,
      image: '/images/banner2.jpg',
      title: '专业服务',
    },
  ]

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      className="h-[500px]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-4xl font-bold">{slide.title}</h2>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
} 