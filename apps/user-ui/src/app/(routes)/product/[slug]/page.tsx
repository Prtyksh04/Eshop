import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import React from 'react';
import ProductDetails from '../../../shared/modules/product/product-details';

async function fetchProductDetails(slug: string) {
  const response = await axiosInstance.get(`/product/api/get-product/${slug}`);
  return response.data.product; // ✅ fix here
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const productDetails = await fetchProductDetails(params.slug);
  return <ProductDetails productDetails={productDetails} />;
};

export default Page;
