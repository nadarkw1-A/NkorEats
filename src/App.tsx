/**
 * NKOR EATS - Enterprise Frontend Storefront
 * A premium West African artisanal food and lifestyle e-commerce experience
 *
 * NEW: Dynamic variant selector system for Shito Sauce line
 * - 4 Spice Levels: Pepper Free, Mild, Spicy, Very Hot
 * - Size variants: 8 oz, 16 oz, 32 oz
 * - Protein toppings: Plain, Halal Beef, Chicken
 * - Dynamic pricing based on selections
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Flame,
  Star,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
  Check,
  Menu,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Size variants with base pricing
type SizeVariant = '8 oz' | '16 oz' | '32 oz';

// Protein topping options
type ProteinVariant = 'Plain (No Meat)' | 'Halal Beef' | 'Chicken';

// Spice level definitions
type SpiceLevel = 'pepper-free' | 'mild' | 'spicy' | 'very-hot';

// Shito Sauce Product with variants
interface ShitoProduct {
  id: string;
  name: string;
  spiceLevel: SpiceLevel;
  spiceLevelDisplay: string;
  spiceRating: number; // 0-5 for visual display
  description: string;
  image: string;
  badge: string;
}

// Selected variants for a product
interface SelectedVariants {
  size: SizeVariant;
  protein: ProteinVariant;
}

// Cart item with full variant information
interface CartItem {
  id: string; // Unique cart item ID (includes variants)
  product: ShitoProduct;
  variants: SelectedVariants;
  price: number; // Calculated final price
  quantity: number;
}

// ============================================================================
// PRICING LOGIC
// ============================================================================

// Base prices by size
const SIZE_BASE_PRICES: Record<SizeVariant, number> = {
  '8 oz': 11.99,
  '16 oz': 18.99,
  '32 oz': 31.99,
};

// Protein addon prices by size
const PROTEIN_ADDONS: Record<SizeVariant, number> = {
  '8 oz': 1.50,
  '16 oz': 2.50,
  '32 oz': 3.50,
};

/**
 * Calculate the final price based on selected variants
 */
function calculatePrice(size: SizeVariant, protein: ProteinVariant): number {
  const basePrice = SIZE_BASE_PRICES[size];
  const hasProtein = protein !== 'Plain (No Meat)';
  const proteinAddon = hasProtein ? PROTEIN_ADDONS[size] : 0;
  return basePrice + proteinAddon;
}

/**
 * Generate a unique cart item ID that includes variant selections
 */
function generateCartItemId(productId: string, variants: SelectedVariants): string {
  return `${productId}-${variants.size.replace(' ', '-')}-${variants.protein.replace(/\s/g, '-')}`;
}

/**
 * Format the display name for cart items
 */
function formatCartItemName(product: ShitoProduct, variants: SelectedVariants, price: number): string {
  return `${product.name} (${variants.size}, ${variants.protein}) - $${price.toFixed(2)}`;
}
// Export for potential use in other components
export { formatCartItemName };

// ============================================================================
// PRODUCT DATA - SHITO SAUCE LINE (4 Spice Levels)
// ============================================================================

const shitoProducts: ShitoProduct[] = [
  {
    id: 'shito-pepper-free',
    name: 'Nkor Shito Sauce - Pepper Free',
    spiceLevel: 'pepper-free',
    spiceLevelDisplay: 'Pepper Free',
    spiceRating: 0,
    description: 'All the rich, savory umami flavor of traditional Shito without the heat. Perfect for those who love deep flavor but prefer zero spice. Made with the same slow-simmered technique.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Family Friendly',
  },
  {
    id: 'shito-mild',
    name: 'Nkor Shito Sauce - Mild',
    spiceLevel: 'mild',
    spiceLevelDisplay: 'Mild',
    spiceRating: 2,
    description: 'A gentle introduction to West African flavors. Subtle warmth with the classic aromatic blend of dried seafood and spices. Perfect balance for everyday cooking.',
    image: 'https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Best Seller',
  },
  {
    id: 'shito-spicy',
    name: 'Nkor Shito Sauce - Spicy',
    spiceLevel: 'spicy',
    spiceLevelDisplay: 'Spicy',
    spiceRating: 4,
    description: 'Authentic Ghanaian heat with layers of complexity. This is the true Shito experience - bold, fiery, and packed with the traditional depth that makes it legendary.',
    image: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Authentic',
  },
  {
    id: 'shito-very-hot',
    name: 'Nkor Shito Sauce - Very Hot',
    spiceLevel: 'very-hot',
    spiceLevelDisplay: 'Very Hot',
    spiceRating: 5,
    description: 'For the true spice warriors. Extra hot peppers bring serious fire while maintaining the signature umami complexity. Not for the faint of heart.',
    image: 'https://images.pexels.com/photos/5490192/pexels-photo-5490192.jpeg?auto=compress&cs=tinysrgb&w=600',
    badge: 'Fiery',
  },
];

// Size options for dropdown
const sizeOptions: SizeVariant[] = ['8 oz', '16 oz', '32 oz'];

// Protein options for dropdown
const proteinOptions: ProteinVariant[] = ['Plain (No Meat)', 'Halal Beef', 'Chicken'];

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================

function Navigation({
  cartCount,
  cartTotal,
  onCartClick,
  onLogoClick,
}: {
  cartCount: number;
  cartTotal: number;
  onCartClick: () => void;
  onLogoClick: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', href: '#shop' },
    { name: 'Our Heritage', href: '#heritage' },
    { name: 'Connect', href: '#connect' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
        scrolled ? 'bg-base-black/80 border-base-slate' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={onLogoClick} className="flex items-center space-x-2 group">
            <div className="flex items-center">
              <Flame className="w-6 h-6 text-accent-orange" />
              <Leaf className="w-4 h-4 text-structural-green -ml-1" />
            </div>
            <span className="text-xl md:text-2xl font-extrabold uppercase tracking-tight text-white group-hover:text-accent-orange transition-colors">
              Nkor Eats
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-accent-orange transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="flex items-center space-x-3 px-4 py-2 bg-base-slate hover:bg-structural-border rounded-lg transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent-orange text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs text-gray-400 block">Cart</span>
                <span className="text-sm text-white font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-base-slate rounded-lg mt-2 p-4 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-gray-300 hover:text-accent-orange transition-colors duration-200 font-medium uppercase tracking-wide text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-base-black">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-structural-green/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Authentic West African Flavors, Crafted for the Modern Kitchen.
            </h1>
            <p className="text-gray-400 text-lg my-6 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Small-batch culinary creations, native spices, and premium lifestyle apparel inspired by ancestral heritage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
              <a
                href="#shop"
                className="bg-accent-orange hover:bg-accent-orange-hover text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-accent-orange/25 flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <span>Explore the Collection</span>
                <ChevronDown className="w-5 h-5" />
              </a>
              <a
                href="#heritage"
                className="border border-accent-gold text-accent-gold px-8 py-4 rounded-lg font-bold transition-all duration-200 hover:bg-accent-gold hover:text-base-black w-full sm:w-auto text-center"
              >
                Read Our Story
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden ring-1 ring-structural-border bg-base-slate shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4199098/pexels-photo-4199098.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium Shito Sauce Jars"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-black/60 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-xl overflow-hidden ring-1 ring-structural-border shadow-xl hidden sm:block">
                <img
                  src="https://images.pexels.com/photos/5490192/pexels-photo-5490192.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Seasoning Mix"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-28 h-28 rounded-xl overflow-hidden ring-1 ring-structural-border shadow-xl hidden sm:block">
                <img
                  src="https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Spices"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-accent-orange/20 via-accent-gold/10 to-structural-green/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SHITO SAUCE PRODUCT CARD WITH VARIANT SELECTORS
// ============================================================================

function ShitoProductCard({
  product,
  onAddToCart,
}: {
  product: ShitoProduct;
  onAddToCart: (product: ShitoProduct, variants: SelectedVariants, price: number) => void;
}) {
  // Default selections
  const [selectedSize, setSelectedSize] = useState<SizeVariant>('8 oz');
  const [selectedProtein, setSelectedProtein] = useState<ProteinVariant>('Plain (No Meat)');

  // Calculate live price
  const currentPrice = calculatePrice(selectedSize, selectedProtein);

  const handleAddToCart = () => {
    onAddToCart(product, { size: selectedSize, protein: selectedProtein }, currentPrice);
  };

  return (
    <div className="group bg-base-slate rounded-xl overflow-hidden ring-1 ring-structural-border hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-black/90 via-base-black/40 to-transparent" />

        {/* Badge */}
        <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent-orange text-white text-xs font-bold uppercase tracking-wide rounded-md">
          {product.badge}
        </span>

        {/* Spice Level */}
        <div className="absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 bg-base-black/80 backdrop-blur-sm rounded-md">
          <Flame className={`w-3.5 h-3.5 ${product.spiceRating > 0 ? 'text-accent-orange' : 'text-gray-500'}`} />
          <span className="text-white text-xs font-semibold">
            {product.spiceRating === 0 ? 'No Heat' : `${product.spiceRating}/5`}
          </span>
        </div>

        {/* Product Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
          <p className="text-xs text-accent-gold uppercase tracking-wide mt-1">{product.spiceLevelDisplay}</p>
        </div>
      </div>

      {/* Content & Variant Selectors */}
      <div className="p-5 space-y-4">
        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>

        {/* Size Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
            Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'bg-accent-orange text-white'
                    : 'bg-base-black text-gray-300 hover:bg-structural-border'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Protein Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
            Protein Topping
          </label>
          <select
            value={selectedProtein}
            onChange={(e) => setSelectedProtein(e.target.value as ProteinVariant)}
            className="w-full py-2.5 px-4 bg-base-black border border-structural-border rounded-lg text-white text-sm focus:outline-none focus:border-accent-orange transition-colors appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1rem',
            }}
          >
            {proteinOptions.map((protein) => (
              <option key={protein} value={protein}>
                {protein}
              </option>
            ))}
          </select>
        </div>

        {/* Price Display */}
        <div className="flex items-center justify-between pt-2 border-t border-structural-border">
          <div>
            <span className="text-2xl font-extrabold text-white">${currentPrice.toFixed(2)}</span>
            <span className="text-xs text-gray-500 block">
              {selectedProtein !== 'Plain (No Meat)' && `+ $${PROTEIN_ADDONS[selectedSize].toFixed(2)} protein`}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-accent-orange hover:bg-accent-gold hover:text-base-black text-white px-5 py-2.5 rounded-lg font-semibold tracking-wide transition-all duration-200 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PRODUCT CATALOG SECTION
// ============================================================================

function ProductCatalog({
  onAddToCart,
}: {
  onAddToCart: (product: ShitoProduct, variants: SelectedVariants, price: number) => void;
}) {
  const [filter, setFilter] = useState<'all' | SpiceLevel>('all');

  const filteredProducts = shitoProducts.filter((product) => {
    if (filter === 'all') return true;
    return product.spiceLevel === filter;
  });

  return (
    <section id="shop" className="py-20 bg-base-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 uppercase tracking-wide">
            Nkor Shito Sauce Collection
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Premium slow-simmered Ghanaian hot pepper sauce in four heat levels. Choose your size and protein topping.
          </p>
        </div>

        {/* Spice Level Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-full font-semibold uppercase tracking-wide text-sm transition-all duration-200 ${
              filter === 'all'
                ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/25'
                : 'bg-base-slate text-gray-400 hover:text-white hover:bg-structural-border'
            }`}
          >
            All Levels
          </button>
          {shitoProducts.map((product) => (
            <button
              key={product.spiceLevel}
              onClick={() => setFilter(product.spiceLevel)}
              className={`px-5 py-2.5 rounded-full font-semibold uppercase tracking-wide text-sm transition-all duration-200 ${
                filter === product.spiceLevel
                  ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/25'
                  : 'bg-base-slate text-gray-400 hover:text-white hover:bg-structural-border'
              }`}
            >
              {product.spiceLevelDisplay}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ShitoProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SHOPPING CART DRAWER (UPDATED FOR VARIANTS)
// ============================================================================

function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-base-slate shadow-2xl z-50 animate-slide-in overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-structural-border">
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">Your Basket</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-structural-border mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Your basket is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-accent-orange hover:text-accent-gold font-semibold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-base-black rounded-xl ring-1 ring-structural-border"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm leading-tight">{item.product.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.variants.size} | {item.variants.protein}
                  </p>
                  <p className="text-accent-gold font-bold mt-1">${item.price.toFixed(2)}</p>

                  <div className="flex items-center mt-3 space-x-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center bg-base-slate hover:bg-structural-border disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-white" />
                    </button>
                    <span className="w-6 text-center text-white font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-base-slate hover:bg-structural-border rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="ml-auto p-1.5 text-gray-400 hover:text-accent-orange transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-structural-border p-6 bg-base-slate">
            <div className="flex justify-between text-lg mb-4">
              <span className="text-gray-400 uppercase tracking-wide">Subtotal</span>
              <span className="text-white font-extrabold">${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="bg-accent-gold text-base-black hover:bg-white w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {showCheckoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCheckoutModal(false)}
          />
          <div className="relative bg-base-slate rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-2xl ring-1 ring-structural-border">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-structural-green/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-10 h-10 text-structural-green" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">Checkout Intercepted</h3>
              <p className="text-gray-400 mb-2">
                Your order totaling <span className="text-accent-gold font-bold text-xl">${subtotal.toFixed(2)}</span> is fully assembled!
              </p>
              <p className="text-sm text-gray-500 mt-4 px-4">
                This frontend is 100% prepared for GitHub deployment and backend API wiring.
              </p>

              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  onClose();
                }}
                className="mt-8 w-full bg-accent-orange hover:bg-accent-gold hover:text-base-black text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// BRAND STORY / HERITAGE SECTION
// ============================================================================

function HeritageSection() {
  return (
    <section id="heritage" className="py-24 bg-base-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-structural-border shadow-2xl">
              <img
                src="https://images.pexels.com/photos/5490192/pexels-photo-5490192.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Artisanal spice preparation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden ring-1 ring-structural-border shadow-2xl hidden lg:block">
              <img
                src="https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Traditional ingredients"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gradient-to-br from-accent-orange/15 via-accent-gold/10 to-structural-green/10 rounded-full blur-3xl" />
          </div>

          <div>
            <span className="inline-block px-4 py-2 bg-accent-orange/20 text-accent-orange font-bold uppercase tracking-wide rounded-md text-sm mb-6">
              Our Heritage
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 leading-tight">
              "We don't believe in shortcuts."
            </h2>
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                Nkor Eats represents a collision of worlds. Our culinary blends honor traditional, small-batch, slow-simmered methods passed down through generations, while our contemporary lifestyle apparel bridges standard utility with historical pride.
              </p>
              <p>
                Every batch of Shito, every grain of seasoning, and every thread of canvas is crafted with absolute dedication to the heritage. We source directly from West African producers who share our commitment to authenticity and quality.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="w-14 h-14 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-7 h-7 text-accent-orange" />
                </div>
                <div className="text-white font-bold text-sm">Small Batch</div>
                <div className="text-gray-500 text-xs mt-1">Production</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-7 h-7 text-accent-gold" />
                </div>
                <div className="text-white font-bold text-sm">Authentic</div>
                <div className="text-gray-500 text-xs mt-1">Recipes</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-structural-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-7 h-7 text-structural-green" />
                </div>
                <div className="text-white font-bold text-sm">Natural</div>
                <div className="text-gray-500 text-xs mt-1">Ingredients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CONNECT / CONTACT SECTION
// ============================================================================

function ContactSection() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="connect" className="py-24 bg-base-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 uppercase tracking-wide">
            Connect With Us
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our products or want to collaborate? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wide">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent-orange" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Email</div>
                    <a href="mailto:hello@nkoreats.com" className="text-gray-400 hover:text-accent-gold transition-colors">
                      hello@nkoreats.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-accent-orange" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Phone</div>
                    <a href="tel:+15551234567" className="text-gray-400 hover:text-accent-gold transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-accent-orange" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Location</div>
                    <span className="text-gray-400">Atlanta, Georgia, USA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-slate rounded-2xl p-6 md:p-8 ring-1 ring-structural-border">
            {isSubmitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-structural-green/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check className="w-10 h-10 text-structural-green" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Message Dispatched!</h3>
                <p className="text-gray-400">
                  Connection logged securely on the frontend. Ready for API endpoint wiring.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className={`w-full px-4 py-3 bg-base-black border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.name ? 'border-red-500' : 'border-structural-border focus:border-accent-orange focus:ring-1 focus:ring-accent-orange'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className={`w-full px-4 py-3 bg-base-black border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-structural-border focus:border-accent-orange focus:ring-1 focus:ring-accent-orange'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 bg-base-black border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
                      errors.message ? 'border-red-500' : 'border-structural-border focus:border-accent-orange focus:ring-1 focus:ring-accent-orange'
                    }`}
                    placeholder="How can we help you? (min 10 characters)"
                  />
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-orange hover:bg-accent-gold hover:text-base-black text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

function Footer() {
  return (
    <footer className="py-12 bg-base-slate border-t border-structural-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-accent-orange" />
            <span className="text-lg font-bold uppercase tracking-wide">
              <span className="text-white">Nkor</span>
              <span className="text-accent-gold"> Eats</span>
            </span>
          </div>

          <nav className="flex items-center space-x-8 text-sm">
            <a href="#shop" className="text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-wide">Shop</a>
            <a href="#heritage" className="text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-wide">Heritage</a>
            <a href="#connect" className="text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-wide">Connect</a>
          </nav>

          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Nkor Eats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add to cart with full variant configuration
  const addToCart = useCallback((product: ShitoProduct, variants: SelectedVariants, price: number) => {
    const cartItemId = generateCartItemId(product.id, variants);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: cartItemId,
        product,
        variants,
        price,
        quantity: 1,
      }];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleLogoClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-base-black" style={{ backgroundColor: '#0B0C10' }}>
      <Navigation
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
        onLogoClick={handleLogoClick}
      />

      <main>
        <HeroSection />
        <ProductCatalog onAddToCart={addToCart} />
        <HeritageSection />
        <ContactSection />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </div>
  );
}
