import request, { gql } from "graphql-request";

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

/**
 * Used to make Get Category API request
 * @returns
 */
const GetCategory = async () => {
  const query = gql`
    query Categories {
      categories(first: 50) {
        id
        slug
        name
        icon {
          url
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};
const GetBusiness = async (category: any) => {
  const query =
    gql`
  query GetBusiness {
  restaurants(where: {categories_some: {slug: "` +
    category +
    `"}}) {
    aboutUs
    address
    banner {
      url
    }
    categories {
      name
    }
    id
    name
    restroType
    slug
    workingHours
    reviews {
      star
    }
  }
}

    `;
  const result = await request(MASTER_URL, query);
  return result;
};
const GetBusinessDetail = async (businessSlug: any) => {
  const query =
    gql`
 query RestaurantDetail {
  restaurant(where: {slug: "` +
    businessSlug +
    `"}) {
    aboutUs
    address
    banner {
      url
    }
    categories {
      name
    }
    id
    name
    restroType
    slug
    workingHours
    menu {
      ... on Menu {
        id
        category
        menuItem {
          ... on MenuItem {
            id
            name
            description
            price
            productImage {
              url
            }
          }
        }
      }
    }
       reviews {
    star
  }
  }
}

    `;
  const result = await request(MASTER_URL, query);
  return result;
};

const AddToCart = async ({ data }: { data: any }) => {
  const query =
    gql`
  mutation AddToCart {
  createUserCart(
    data: {email: "` +
    data.email +
    `", price: ` +
    data?.price +
    `, productDescription: "` +
    data?.description +
    `", productImage: "` +
    data?.productImage +
    `", productName: "` +
    data?.name +
    `"
    restaurant: {connect: {slug: "` +
    data?.restaurantSlug +
    `"}}},
    
  ) {
    id
  }
  publishManyUserCarts(to: PUBLISHED) {
    count
  }
}


  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const GetUserCart = async (userEmail: any) => {
  const query =
    gql`
    query GetUserCart {
      userCarts(where: { email: "` +
    userEmail +
    `" }) {
        id
        price
        productDescription
        productImage
        productName
        restaurant {
      name
      banner {
        url
      }
      slug
    }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const DisconnectRestaurantFromCartItem = async (id: any) => {
  const query = gql`
mutation DisconnectRestaurantFromCartItem {
  updateUserCart(data: {restaurant: {disconnect: true}}, where: {id: "`+id+`"}) {
    id
  }
  publishManyUserCarts(to: PUBLISHED) {
    count
  }
}
  `;

  try {
    const result = await request(MASTER_URL, query, { id });
    console.log("Disconnect result:", result); // Depuración
    return result;
  } catch (error) {
    console.error("Error in DisconnectRestaurantFromCartItem:", error);
    return null;
  }
};

const DeleteItemFromCart = async (id: any) => {
  const query = gql`
mutation DeleteCartItem {
  deleteUserCart(where: {id: "` +id+`"}) {
    id
  }
}
  `;

  try {
    const result = await request(MASTER_URL, query, { id });
    console.log("Delete result:", result); // Depuración
    return result;
  } catch (error) {
    console.error("Error in DeleteItemFromCart:", error);
    return null;
  }
};
interface ReviewData {
  email: string;
  profileImage: string;
  userName: string;
  star: number;
  reviewText: string;
  RetroSlug: string;
}
const AddNewReview = async (data: ReviewData) => {
  const query =
    gql`
    mutation AddNewReview {
  createReview(
    data: {email: "` +
    data.email +
    `", 
    profileImage: "` +
    data.profileImage +
    `", reviewText: "` +
    data.reviewText +
    `",
    star:` +
    data.star +
    `, userName: "` +
    data.userName +
    `",
     restaurant: {connect: {slug: "` +
    data.RetroSlug +
    `"}}}
  ) {
    id
  }
  publishManyReviews(to: PUBLISHED) {
    count
  }
}

  `;

  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("GraphQL Error:", error);
    throw error;
  }
};

const getRestaurantReviews = async (slug: string) => {
  const query =
    gql`
query RestaurantReviews {
  reviews(where: {restaurant: {slug: "` +
    slug +
    `"}}, orderBy: publishedAt_DESC) {
    email
    id
    profileImage
    publishedAt
    userName
    star
    reviewText
  }
}

  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const CreateNewOrder = async (data: any) => {
  const query =
    gql`
    mutation CreateNewOrder {
  createOrder(
    data: {email: "` +
    data.email +
    `", 
    orderAmount: ` +
    data.orderAmount +
    `, 
    restaurantName: "` +
    data.restaurantName +
    `", 
    phone: "` +
    data.phone +
    `", address: "` +
    data.address +
    `", 
    userName: "` +
    data.userName +
    `", 
    zipCode: "` +
    data.zipCode +
    `"}
  ) {
    id
  }
}

  `;

  try {
    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error("Error in CreateNewOrder:", error);
    return null;
  }
};

const UpdateOrderToAddOrderItems = async (
  name: string,
  price: any,
  id: string,
  email: string
) => {
  const query = gql`
    mutation UpdateOrderWithDetail {
      updateOrder(
        data: {
          orderDetail: {
            create: { OrderItem: { data: { name: "${name}", price: ${price} } } }
          }
        }
        where: { id: "${id}" }
      ) {
        id
      }
        
  publishManyOrders(to: PUBLISHED) {
    count
  }
   
  deleteManyUserCarts(where: {email: "${email}"}) {
    count
  
}

    }
  `;

  const MAX_RETRIES = 5;
  const RETRY_DELAY = 1000; // Initial delay in milliseconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await request(MASTER_URL, query);
      return result;
    } catch (error) {
      if ((error as any).response?.status === 429 && attempt < MAX_RETRIES) {
        // If rate limit error, wait and retry
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * attempt)
        );
      } else {
        // If other error or max retries reached, throw error
        throw error;
      }
    }
  }
};

const GetUserOrders = async (email: string) => {
  const query = gql`
  query UseOrders {
  orders(where: {email: "`+email+`"}, orderBy: publishedAt_DESC) {
    address
    createdAt
    email
    id
    orderAmount
    orderDetail {
      ... on OrderItem {
        id
        name
        price
      }
    }
    phone
    restaurantName
    userName
    zipCode
  }
}
`
const result = await request(MASTER_URL, query);
return result;

}; 

export default {
  GetCategory,
  GetBusiness,
  GetBusinessDetail,
  AddToCart,
  GetUserCart,
  DisconnectRestaurantFromCartItem,
  DeleteItemFromCart,
  AddNewReview,
  getRestaurantReviews,
  CreateNewOrder,
  UpdateOrderToAddOrderItems,
  GetUserOrders,
};
