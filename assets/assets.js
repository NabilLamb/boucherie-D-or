import logo from "./logo.png";
import user_icon from "./user_icon.svg";
import add_icon from "./add_icon.svg";
import order_icon from "./order_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import my_location_image from "./my_location_image.svg";
import heart_icon from "./heart_icon.svg";
import checkmark from "./checkmark.png";


//About us import
import ShopFront from "./aboutUs/shop-front.jpg"
import FamilyButchers from "./aboutUs/family-butchers.jpg"
import ArtisanButchery from "./aboutUs/ArtisanButchery.jpg"
import PremiumSelection from "./aboutUs/PremiumSelection.jpg"
import ExpertGuidance from "./aboutUs/ExpertGuidance.jpg"
import abdel_meal from "./aboutUs/abdel_meat.png"
import annais_meal from "./aboutUs/annais_meat.png"

//Contact us import
import ContactHero from "./contactUs/ContactHero.jpg"


// Product default image
import default_img from "./default_img.png";



export const assets = {
  logo,
  user_icon,
  add_icon,
  order_icon,
  instagram_icon,
  facebook_icon,
  twitter_icon,
  product_list_icon,
  my_location_image,
  heart_icon,
  checkmark,


  //About us
  ShopFront,
  FamilyButchers,
  ArtisanButchery,
  PremiumSelection,
  ExpertGuidance,
  abdel_meal,
  annais_meal,

  //Contact us
  ContactHero,


  // Product default image
  default_img,
};

export const CartIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} stroke-gray-600`}
    >
      <path d="M0.75 0.75H3.75L5.76 10.7925C5.82858 11.1378 6.01643 11.448 6.29066 11.6687C6.56489 11.8895 6.90802 12.0067 7.26 12H14.55C14.902 12.0067 15.2451 11.8895 15.5193 11.6687C15.7936 11.448 15.9814 11.1378 16.05 10.7925L17.25 4.5H4.5M7.5 15.75C7.5 16.1642 7.16421 16.5 6.75 16.5C6.33579 16.5 6 16.1642 6 15.75C6 15.3358 6.33579 15 6.75 15C7.16421 15 7.5 15.3358 7.5 15.75ZM15.75 15.75C15.75 16.1642 15.4142 16.5 15 16.5C14.5858 16.5 14.25 16.1642 14.25 15.75C14.25 15.3358 14.5858 15 15 15C15.4142 15 15.75 15.3358 15.75 15.75Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const BagIcon = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} stroke-gray-600`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
      />
    </svg>
  )
}

export const HeartIcon = ({ filled, className }) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);


export const BoxIcon = ({ className, width = 24, height = 24 }) => (
  <svg 
    className={className}
    width={width}
    height={height}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      fill="#FBF063" 
      d="M7 22L50 0l43 22-43 21.001L7 22z"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      fill="#F29C1F" 
      d="M50.003 42.997L7 22v54.28l43.006 21.714-.003-54.997z"
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      fill="#F0C419" 
      d="M50 97.994L93.006 76.28V22L50.003 42.997 50 97.994z"
    />
    <path 
      opacity="0.5" 
      fillRule="evenodd" 
      clipRule="evenodd" 
      fill="#F29C1F" 
      d="M27.036 11.705l42.995 21.498 2.263-1.105-43.047-21.524z"
    />
    <path 
      opacity="0.5" 
      fillRule="evenodd" 
      clipRule="evenodd" 
      fill="#ffffff" 
      d="M21.318 14.674L63.3 36.505l15.99-7.809L35.788 7.271z"
    />
    <path 
      opacity="0.5" 
      fillRule="evenodd" 
      clipRule="evenodd" 
      fill="#ffffff" 
      d="M63.312 36.505l15.978-7.818v11l-15.978 8.817V36.505z"
    />
  </svg>
);

export const HomeIcon = () => (
  <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
  </svg>
);

export const successIcon = () => (
  <svg width="24px" height="24px" viewBox="0 0 512 512" fill="#22c55e">
    <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.43872,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.438933,384 213.333333,384 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z" />
  </svg>
);

export const searchIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="21"
      y1="21"
      x2="15"
      y2="15"
      stroke="rgb(44, 169, 188)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="10"
      cy="10"
      r="7"
      stroke="rgb(0, 0, 0)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);











