import logo from "./logo.png";
import search_icon from "./search_icon.svg";
import user_icon from "./user_icon.svg";
import cart_icon from "./cart_icon.svg";
import add_icon from "./add_icon.svg";
import order_icon from "./order_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import twitter_icon from "./twitter_icon.svg";
import box_icon from "./box_icon.svg";
import product_list_icon from "./product_list_icon.svg";
import menu_icon from "./menu_icon.svg";
import arrow_icon from "./arrow_icon.svg";
import increase_arrow from "./increase_arrow.svg";
import decrease_arrow from "./decrease_arrow.svg";
import arrow_right_icon_colored from "./arrow_right_icon_colored.svg";
import my_location_image from "./my_location_image.svg";
import arrow_icon_white from "./arrow_icon_white.svg";
import heart_icon from "./heart_icon.svg";
import star_icon from "./star_icon.svg";
import redirect_icon from "./redirect_icon.svg";
import star_dull_icon from "./star_dull_icon.svg";
import upload_area from "./upload_area.png";
import checkmark from "./checkmark.png";
import annais_meal from "./annais_meat.png"
import abdel_meal from "./abdel_meat.png"
import abdel_oven from "./abdel_oven.png"

// Product Images
import PremiumAngusBeefSteak_image from "./PremiumAngusBeefSteak_image.png";
import PremiumAngusBeefSteak_image1 from "./PremiumAngusBeefSteak_image1.png";
import PremiumAngusBeefSteak_image2 from "./PremiumAngusBeefSteak_image2.png";
import PremiumAngusBeefSteak_image3 from "./PremiumAngusBeefSteak_image3.png";
import PremiumAngusBeefSteak_image4 from "./PremiumAngusBeefSteak_image4.png";
import lamb_chops from "./lamb_chops.png";
import chicken_breast from "./chicken_breast.png";
import chefs_knife from "./chefs_knife.png";
import cutting_board from "./cutting_board.png";
import mineral_water from "./mineral_water.png";
import potato_chips from "./potato_chips.png";
import organic_tomatoes from "./organic_tomatoes.png";
import fresh_basil from "./fresh_basil.png";
import beef_salami from "./beef_salami.png";
import aged_gouda from "./aged_gouda.png";
import valencia_oranges from "./valencia_oranges.png";
import artisan_baguette from "./artisan_baguette.png";
import grill_pan from "./grill_pan.png";
import mixed_skewers from "./mixed_skewers.png";
import organic_eggs from "./organic_eggs.png";
import olive_oil from "./olive_oil.png";
import meatsHeader from "./meatsHeader.png"
import VegetablesFruitsHeader from "./VegetablesFruitsHeader.png"
import KitchenToolsHeader from "./KitchenToolsHeader.png"
import WoodOvensHeader from "./WoodOvensHeader.png"

export const assets = {
  logo,
  search_icon,
  user_icon,
  cart_icon,
  add_icon,
  order_icon,
  instagram_icon,
  facebook_icon,
  twitter_icon,
  box_icon,
  product_list_icon,
  menu_icon,
  arrow_icon,
  increase_arrow,
  decrease_arrow,
  arrow_right_icon_colored,
  my_location_image,
  arrow_icon_white,
  heart_icon,
  star_icon,
  redirect_icon,
  star_dull_icon,
  upload_area,
  checkmark,
  annais_meal,
  abdel_meal,
  abdel_oven,

  //Header Images
  meatsHeader,
  VegetablesFruitsHeader,
  KitchenToolsHeader,
  WoodOvensHeader,

  // Product Images
  PremiumAngusBeefSteak_image,
  PremiumAngusBeefSteak_image1,
  PremiumAngusBeefSteak_image2,
  PremiumAngusBeefSteak_image3,
  PremiumAngusBeefSteak_image4,
  lamb_chops,
  chicken_breast,
  chefs_knife,
  cutting_board,
  mineral_water,
  potato_chips,
  organic_tomatoes,
  fresh_basil,
  beef_salami,
  aged_gouda,
  valencia_oranges,
  artisan_baguette,
  grill_pan,
  mixed_skewers,
  organic_eggs,
  olive_oil,

  
};

export const BagIcon = () => {
  return (
    <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
    </svg>
  )
}

export const CartIcon = () => {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.75 0.75H3.75L5.76 10.7925C5.82858 11.1378 6.01643 11.448 6.29066 11.6687C6.56489 11.8895 6.90802 12.0067 7.26 12H14.55C14.902 12.0067 15.2451 11.8895 15.5193 11.6687C15.7936 11.448 15.9814 11.1378 16.05 10.7925L17.25 4.5H4.5M7.5 15.75C7.5 16.1642 7.16421 16.5 6.75 16.5C6.33579 16.5 6 16.1642 6 15.75C6 15.3358 6.33579 15 6.75 15C7.16421 15 7.5 15.3358 7.5 15.75ZM15.75 15.75C15.75 16.1642 15.4142 16.5 15 16.5C14.5858 16.5 14.25 16.1642 14.25 15.75C14.25 15.3358 14.5858 15 15 15C15.4142 15 15.75 15.3358 15.75 15.75Z" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <rect width="18" height="18" fill="white" />
      </defs>
    </svg>
  )
}

export const BoxIcon = () => (
  <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 21v-9m3-4H7.5a2.5 2.5 0 1 1 0-5c1.5 0 2.875 1.25 3.875 2.5M14 21v-9m-9 0h14v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8ZM4 8h16a1 1 0 0 1 1 1v3H3V9a1 1 0 0 1 1-1Zm12.155-5c-3 0-5.5 5-5.5 5h5.5a2.5 2.5 0 0 0 0-5Z" />
  </svg>
);

export const HomeIcon = () => (
  <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
  </svg>
);

export const productsDummyData = [
  {
    "_id": "1",
    "userId": "butcher_shop",
    "name": "Premium Angus Beef Steak",
    "description": "Prime cut aged beef, perfect for grilling",
    "price": 24.99,
    "offerPrice": 22.99,
    "image": [
      assets.PremiumAngusBeefSteak_image,
      assets.PremiumAngusBeefSteak_image1,
      assets.PremiumAngusBeefSteak_image2,
      assets.PremiumAngusBeefSteak_image3,
      assets.PremiumAngusBeefSteak_image4
    ],
    "category": "Meats",
    "subCategory": "Beef",
    "rating": 4.8,
    "unit": "kg",
    "date": 1738667236865,
    "__v": 0
  },
  {
    "_id": "2",
    "userId": "butcher_shop",
    "name": "New Zealand Lamb Chops",
    "description": "Fresh frenched lamb chops",
    "price": 18.50,
    "offerPrice": 16.99,
    "image": [assets.lamb_chops],
    "category": "Meats",
    "subCategory": "Lamb",
    "rating": 4.7,
    "unit": "kg",
    "date": 1738667310300,
    "__v": 0
  },
  {
    "_id": "3",
    "userId": "butcher_shop",
    "name": "Organic Chicken Breast",
    "description": "Skinless, boneless, antibiotic-free",
    "price": 9.99,
    "image": [assets.chicken_breast],
    "category": "Meats",
    "subCategory": "Poultry",
    "rating": 4.6,
    "unit": "kg",
    "date": 1738667366224,
    "__v": 0
  },
  {
    "_id": "4",
    "userId": "butcher_shop",
    "name": "Professional Chef's Knife",
    "description": "High-carbon steel kitchen knife",
    "price": 89.99,
    "image": [assets.chefs_knife],
    "category": "Kitchen Tools",
    "subCategory": "Cutlery",
    "rating": 4.7,
    "unit": "piece",
    "date": 1738667503075,
    "__v": 0
  },
  {
    "_id": "5",
    "userId": "butcher_shop",
    "name": "Artisan Baguette",
    "description": "Freshly baked French bread",
    "price": 3.99,
    "image": [assets.artisan_baguette],
    "category": "Baked Goods",
    "subCategory": "Breads",
    "rating": 4.5,
    "unit": "piece",
    "date": 1738667788883,
    "__v": 0
  },
  {
    "_id": "6",
    "userId": "butcher_shop",
    "name": "Organic Free-Range Eggs",
    "description": "Grade AA eggs, 12-pack",
    "price": 4.49,
    "image": [assets.organic_eggs],
    "category": "Dairy & Eggs",
    "subCategory": "Eggs",
    "rating": 4.8,
    "unit": "pack",
    "date": 1738667977644,
    "__v": 0
  },
  {
    "_id": "7",
    "userId": "butcher_shop",
    "name": "Extra Virgin Olive Oil",
    "description": "Cold pressed, 1L bottle",
    "price": 8.99,
    "image": [assets.olive_oil],
    "category": "Pantry Essentials",
    "subCategory": "Oils & Vinegars",
    "rating": 4.9,
    "unit": "liter",
    "date": 1738668086331,
    "__v": 0
  }
];

export const userDummyData = {
  "_id": "user_butcher_shop",
  "name": "Halal Butcher",
  "email": "contact@halalbutcher.com",
  "imageUrl": "",
  "cartItems": {},
  "__v": 0
};

export const orderDummyData = [
  {
    "_id": "order1",
    "userId": "user_butcher_shop",
    "items": [
      {
        "product": productsDummyData[0],
        "quantity": 2
      }
    ],
    "amount": 45.98,
    "address": {
      "_id": "address1",
      "fullName": "John Doe",
      "phoneNumber": "0123456789",
      "pincode": "12345",
      "area": "Main Street 123",
      "city": "London",
      "state": "England"
    },
    "status": "Delivered"
  }
];

export const addressDummyData = [
  {
    "_id": "address1",
    "userId": "user_butcher_shop",
    "fullName": "John Doe",
    "phoneNumber": "0123456789",
    "pincode": "12345",
    "area": "Main Street 123",
    "city": "London",
    "state": "England"
  }
];