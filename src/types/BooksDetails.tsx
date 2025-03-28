export interface BookDetails {
  title: string;
  description: string;
  contributor: string;
  author: string;
  publisher: string;
  price: string;
  primary_isbn13: string;
  image: string;
}

export interface Book {
  rank: number;
  amazon_product_url: string;
  book_details: BookDetails[];
}

export interface ApiResponse {
  results: Book[];
}