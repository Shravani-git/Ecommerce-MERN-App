import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { CartContext } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar"; 
import { HiMinusSm, HiPlusSm } from "react-icons/hi";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        // default main image or placeholder
        setMainImg(res.data.images?.[0] || "https://via.placeholder.com/600x600?text=Product");
        // if product has categories, fetch similar
        if (res.data.category) {
          const s = await api.get("/products", { params: { category: res.data.category, limit: 3 } });
          // exclude current product
          setSimilar((s.data.products || []).filter(p => p._id !== id).slice(0, 3));
        }
      } catch (err) {
        console.error("load product err", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    // same loading logic...
  }, [id]);
  
  const onAdd = async () => {
    if (!product) return;
    setAdding(true);
    try {
      // ensure quantity is at least 1
      const res = await addToCart(product._id, qty);
      if (!res.ok) {
        toast.error("Could not add to cart — are you logged in?");
      } else {
        // small UI feedback
        toast.success("Added to cart");
      }
    } catch (err) {
      console.error("add to cart", err);
      toast.error("Add to cart failed");
    } finally {
      setAdding(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  // Example sizes (you can replace with product.sizes if available)
  const sizes = product.sizes || ["S", "M", "L", "XL"];

  // Example color palette (if images represent colors)
  const colors = product.colors || product.images?.map((_, i) => `Color ${i + 1}`) || ["Default"];

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={() => {}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">Home</Link> / <span className="capitalize">{product.category}</span> / <span>{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: gallery */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="w-full h-[520px] flex items-center justify-center bg-gray-100">
                <img src={mainImg} alt={product.title} className="object-contain max-h-full" />
              </div>

              {/* thumbnails */}
              <div className="p-4 flex items-center gap-3 overflow-x-auto">
                {(product.images && product.images.length > 0 ? product.images : ["https://via.placeholder.com/180x180?text=Img"]).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(src)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border ${mainImg === src ? 'border-indigo-500' : 'border-gray-200'}`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* small product details below gallery */}
            <div className="mt-6 space-y-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-2">Product details</h4>
                <p className="text-sm text-gray-600">{product.description || "No description provided."}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold mb-2">Delivery</h4>
                <p className="text-sm text-gray-600">Free delivery within 3–5 business days. Easy 14 days returns.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: info & buy box */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                  <h1 className="text-2xl font-bold">{product.title}</h1>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 line-through">{product.originalPrice ? `₹${product.originalPrice}` : ''}</div>
                  <div className="text-2xl font-extrabold text-indigo-600">₹{product.price}</div>
                </div>
              </div>

              {/* rating placeholder */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="bg-yellow-400 text-white px-2 py-0.5 rounded">★ 4.5</div>
                <div> • 2.6k reviews</div>
              </div>

              {/* color selection */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Color</div>
                <div className="flex items-center gap-3">
                  {colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedColor(c);
                        if (product.images?.[idx]) setMainImg(product.images[idx]);
                      }}
                      className={`w-9 h-9 rounded-full border ${selectedColor === c ? 'ring-2 ring-indigo-300' : 'border-gray-200'}`}
                      title={c}
                    >
                      {/* if you have actual color hex use background; otherwise show initials */}
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-700">{c[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* size selection */}
              <div>
                <div className="text-sm text-gray-600 mb-2">Size</div>
                <div className="flex items-center gap-3">
                  {sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1 border rounded ${selectedSize === sz ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* quantity + add to cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600"><HiMinusSm/></button>
                  <div className="px-4">{qty}</div>
                  <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-gray-600"><HiPlusSm/></button>
                </div>

                <button
                  onClick={onAdd}
                  disabled={adding}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 disabled:opacity-60"
                >
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              {/* small meta */}
              <div className="text-sm text-gray-500">
                <div>SKU: {product.sku || "N/A"}</div>
                <div>Stock: {product.stock ?? "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar products */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Similar products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.length ? similar.map(p => (
              <ProductCard key={p._id} product={p} onAdd={() => addToCart(p._id, 1)} />
            )) : (
              <div className="text-gray-500">No similar products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
