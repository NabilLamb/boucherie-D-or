import logo from "./logo.png";
import user_icon from "./user_icon.svg";
import cart_icon from "./cart_icon.svg";
import add_icon from "./add_icon.svg";
import order_icon from "./order_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import twitter_icon from "./twitter_icon.svg";
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
import abdel_oven from "./abdel_oven.png"

// Product Images
import PremiumAngusBeefSteak_image from "./products_img/PremiumAngusBeefSteak_image.png";
import PremiumAngusBeefSteak_image1 from "./products_img/PremiumAngusBeefSteak_image1.png";
import PremiumAngusBeefSteak_image2 from "./products_img/PremiumAngusBeefSteak_image2.png";
import PremiumAngusBeefSteak_image3 from "./products_img/PremiumAngusBeefSteak_image3.png";
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

//About us import
import ShopFront from "./aboutUs/shop-front.jpg"
import FamilyButchers from "./aboutUs/family-butchers.jpg"
import ArtisanButchery from "./aboutUs/ArtisanButchery.jpg"
import PremiumSelection from "./aboutUs/PremiumSelection.jpg"
import ExpertGuidance from "./aboutUs/ExpertGuidance.jpg"
import abdel_meal from "./aboutUs/abdel_meat.png"
import annais_meal from "./aboutUs/annais_meat.png"
import iconGoogleMaps from "./aboutUs/icon-google-maps.svg"

//Contact us import
import ContactHero from "./contactUs/ContactHero.jpg"

//products import
import default_img from "./products_img/default-product.png"
import spicy_sausage from "./products_img/spicy_sausage.png"
import cold_cuts from "./products_img/cold_cuts.jpg"
import gourmet_deli_sandwich from "./products_img/gourmet_deli_sandwich.jpg"
import bbq_pack from "./products_img/bbq_pack.jpeg"
import sparkling_water from "./products_img/sparkling_water.jpg"
import fresh_apples from "./products_img/fresh_apples.jpg"
import organic_carrots from "./products_img/organic_carrots.png"
import electric_oven from "./products_img/electric_oven.png"



export const assets = {
  logo,
  user_icon,
  cart_icon,
  add_icon,
  order_icon,
  instagram_icon,
  facebook_icon,
  twitter_icon,
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
  abdel_oven,

  //About us
  ShopFront,
  FamilyButchers,
  ArtisanButchery,
  PremiumSelection,
  ExpertGuidance,
  abdel_meal,
  annais_meal,
  iconGoogleMaps,

  //Contact us
  ContactHero,

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

  default_img,
  spicy_sausage,
  cold_cuts,
  gourmet_deli_sandwich,
  bbq_pack,
  sparkling_water,
  fresh_apples,
  organic_carrots,
  electric_oven,

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

export const HeartIcon = ({ className = "w-6 h-6", filled = false }) => (
  <svg
    className={`${className} ${filled ? "fill-red-500" : "fill-white"}`}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"  // Add stroke for outline
  >
    <path 
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.88 4.78a3.489 3.489 0 0 0-.37-.9 3.24 3.24 0 0 0-.6-.79 3.78 3.78 0 0 0-1.21-.81 3.74 3.74 0 0 0-2.84 0 4 4 0 0 0-1.16.75l-.05.06-.65.65-.65-.65-.05-.06a4 4 0 0 0-1.16-.75 3.74 3.74 0 0 0-2.84 0 3.78 3.78 0 0 0-1.21.81 3.55 3.55 0 0 0-.97 1.69 3.75 3.75 0 0 0-.12 1c0 .317.04.633.12.94a4 4 0 0 0 .36.89 3.8 3.8 0 0 0 .61.79L8 14.31l5.91-5.91c.237-.233.44-.5.6-.79A3.578 3.578 0 0 0 15 5.78a3.747 3.747 0 0 0-.12-1zm-1 1.63a2.69 2.69 0 0 1-.69 1.21l-5.21 5.2-5.21-5.2a2.9 2.9 0 0 1-.44-.57 3 3 0 0 1-.27-.65 3.25 3.25 0 0 1-.08-.69A3.36 3.36 0 0 1 2.06 5a2.8 2.8 0 0 1 .27-.65c.12-.21.268-.4.44-.57a2.91 2.91 0 0 1 .89-.6 2.8 2.8 0 0 1 2.08 0c.33.137.628.338.88.59l1.36 1.37 1.36-1.37a2.72 2.72 0 0 1 .88-.59 2.8 2.8 0 0 1 2.08 0c.331.143.633.347.89.6.174.165.32.357.43.57a2.69 2.69 0 0 1 .35 1.34 2.6 2.6 0 0 1-.06.72h-.03z" 
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



export const productsDummyData = [
  {
    "_id": "1",
    "userId": "butcher_shop",
    "name": "Premium Angus Beef Steak",
    "description": "Prime cut aged beef, perfect for grilling",
    "price": 24.99,
    "offerPrice": 22.99,
    "image": [
      "PremiumAngusBeefSteak_image",
      "PremiumAngusBeefSteak_image1",
      "PremiumAngusBeefSteak_image2",
      "PremiumAngusBeefSteak_image3",
      "PremiumAngusBeefSteak_image4"
    ],
    "category": "BEEF",
    "unit": "kg",
    "date": 1738667236865,
    "__v": 0
  },
  {
    "_id": "2",
    "userId": "butcher_shop",
    "name": "New Zealand Lamb Chops",
    "description": "Fresh frenched lamb chops",
    "price": 18.5,
    "image": ["lamb_chops"],
    "category": "LAMB",
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
    "image": ["chicken_breast"],
    "category": "POULTRY",
    "unit": "kg",
    "date": 1738667366224,
    "__v": 0
  },
  {
    "_id": "4",
    "userId": "butcher_shop",
    "name": "Spicy Italian Sausage",
    "description": "Traditional Italian sausage with a spicy kick",
    "price": 12.99,
    "image": ["spicy_sausage"],
    "category": "SAUSAGE",
    "unit": "kg",
    "date": 1738667503075,
    "__v": 0
  },
  {
    "_id": "5",
    "userId": "butcher_shop",
    "name": "Assorted Cold Cuts Platter",
    "description": "A selection of fine cold cuts perfect for sharing",
    "price": 29.99,
    "image": ["cold_cuts"],
    "category": "COLD CUTS",
    "unit": "pack",
    "date": 1738667788883,
    "__v": 0
  },
  {
    "_id": "6",//
    "userId": "butcher_shop",
    "name": "Gourmet Deli Sandwich",
    "description": "A classic deli sandwich with premium ingredients",
    "price": 8.99,
    "image": ["gourmet_deli_sandwich"],
    "category": "DELI",
    "unit": "piece",
    "date": 1738667977644,
    "__v": 0
  },
  {
    "_id": "7",
    "userId": "butcher_shop",
    "name": "BBQ Pack for 4",
    "description": "A complete BBQ package for a family gathering",
    "price": 49.99,
    "image": ["bbq_pack"],
    "category": "BBQ PACK",
    "unit": "pack",
    "date": 1738668086331,
    "__v": 0
  },
  {
    "_id": "8",
    "userId": "butcher_shop",
    "name": "Sparkling Water",
    "description": "Refreshing and crisp sparkling water",
    "price": 1.99,
    "image": ["sparkling_water"],
    "category": "DRINKS",
    "unit": "bottle",
    "date": 1738668200000,
    "__v": 0
  },
  {
    "_id": "9",
    "userId": "butcher_shop",
    "name": "Fresh Apples",
    "description": "Crisp and juicy apples from local orchards",
    "price": 3.99,
    "image": ["fresh_apples"],
    "category": "FRUITS",
    "unit": "kg",
    "date": 1738668300000,
    "__v": 0
  },
  {
    "_id": "10", //
    "userId": "butcher_shop",
    "name": "Organic Carrots",
    "description": "Freshly harvested organic carrots",
    "price": 2.99,
    "image": ["organic_carrots"],
    "category": "VEGETABLES",
    "unit": "kg",
    "date": 1738668400000,
    "__v": 0
  },
  {
    "_id": "11",//
    "userId": "butcher_shop",
    "name": "Electric Oven 220V",
    "description": "High performance electric oven suitable for any kitchen",
    "price": 199.99,
    "image": ["electric_oven"],
    "category": "OVENS",
    "unit": "unit",
    "date": 1738668500000,
    "__v": 0
  },
  {
    "_id": "12",
    "userId": "butcher_shop",
    "name": "Professional Chef's Knife",
    "description": "High-carbon steel kitchen knife",
    "price": 89.99,
    "image": ["chefs_knife"],
    "category": "KITCHENE TOOLS",
    "unit": "piece",
    "date": 1738668600000,
    "__v": 0
  },
  // --- Additional Products ---
  // BEEF additional products (IDs 13-16)
  {
    "_id": "13",
    "name": "Wagyu Ribeye Steak",
    "description": "Japanese A5 wagyu with perfect marbling texture",
    "price": 89.99,
    "offerPrice": 79.99,
    "image": [],
    "category": "BEEF",
    "unit": "kg"
  },
  {
    "_id": "14",
    "name": "Dry-Aged Tomahawk",
    "description": "45-day dry-aged tomahawk steak with bone-in",
    "price": 65.00,
    "offerPrice": 55.00,
    "image": [],
    "category": "BEEF",
    "unit": "kg"
  },

  // LAMB (15-16)
  {
    "_id": "15",
    "name": "Herb-Crusted Rack of Lamb",
    "description": "French-trimmed rack with rosemary & garlic crust",
    "price": 42.99,
    "offerPrice": 37.99,
    "image": [],
    "category": "LAMB",
    "unit": "kg"
  },
  {
    "_id": "16",
    "name": "Lamb Kofta Skewers",
    "description": "Pre-marinated Middle Eastern-style lamb skewers",
    "price": 19.99,
    "image": [],
    "category": "LAMB",
    "unit": "kg"
  },

  // POULTRY (17-18)
  {
    "_id": "17",
    "name": "Free-Range Turkey Drumsticks",
    "description": "Jumbo drumsticks brined for 24 hours",
    "price": 8.99,
    "offerPrice": 7.49,
    "image": [],
    "category": "POULTRY",
    "unit": "kg"
  },
  {
    "_id": "18",
    "name": "Duck Breast Magret",
    "description": "French-style duck breast with crispy skin",
    "price": 22.50,
    "image": [],
    "category": "POULTRY",
    "unit": "kg"
  },

  // SAUSAGE (19-20)
  {
    "_id": "19",
    "name": "Chorizo Picante",
    "description": "Spanish smoked paprika sausage with chili",
    "price": 14.99,
    "offerPrice": 12.99,
    "image": [],
    "category": "SAUSAGE",
    "unit": "kg"
  },
  {
    "_id": "20",
    "name": "Boudin Noir",
    "description": "Traditional French blood sausage with apples",
    "price": 18.75,
    "image": [],
    "category": "SAUSAGE",
    "unit": "kg"
  },

  // COLD CUTS (21-22)
  {
    "_id": "21",
    "name": "San Daniele Ham",
    "description": "Aged 18-month Italian prosciutto",
    "price": 45.00,
    "offerPrice": 39.99,
    "image": [],
    "category": "COLD CUTS",
    "unit": "pack"
  },
  {
    "_id": "22",
    "name": "Saucisson Sec",
    "description": "French dry-cured sausage with black pepper",
    "price": 28.50,
    "image": [],
    "category": "COLD CUTS",
    "unit": "pack"
  },

  // DRINKS (23)
  {
    "_id": "23",
    "name": "Craft Ginger Beer",
    "description": "Small-batch fermented ginger beer",
    "price": 3.99,
    "offerPrice": 2.99,
    "image": [],
    "category": "DRINKS",
    "unit": "bottle"
  },

  // FRUITS (24)
  {
    "_id": "24",
    "name": "Organic Blood Oranges",
    "description": "Sicilian blood oranges with deep red flesh",
    "price": 6.99,
    "image": [],
    "category": "FRUITS",
    "unit": "kg"
  },

  // KITCHENE TOOLS (25)
  {
    "_id": "25",
    "name": "Japanese Nakiri Knife",
    "description": "VG-10 steel vegetable cleaver",
    "price": 129.99,
    "offerPrice": 109.99,
    "image": [],
    "category": "KITCHENE TOOLS",
    "unit": "piece"
  }
];



export const userDummyData = {
  "_id": "user_butcher_shop",
  "name": "Halal Butcher",
  "email": "contact@halalbutcher.com",
  "imageUrl": assets.user_icon,
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