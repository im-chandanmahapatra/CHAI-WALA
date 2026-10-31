import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coffee,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  ArrowLeft,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Product } from '../../lib/database.types';

export const AdminMenuPage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceRupees, setNewPriceRupees] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadProducts();
  }, [isAdmin, navigate]);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('products').select();
    if (data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  const handleToggleAvailability = async (product: Product) => {
    const updatedStatus = !product.isAvailable;
    await (supabase as any)
      .from('products')
      .update({ isAvailable: updatedStatus })
      .eq('id', product.id);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isAvailable: updatedStatus } : p))
    );

    showNotification(
      `${product.name} is now ${updatedStatus ? 'AVAILABLE' : '86’D (SOLD OUT)'}`
    );
  };

  const handleStartEditPrice = (product: Product) => {
    setEditingPriceId(product.id);
    setNewPriceRupees(Math.round(product.basePricePaise / 100));
  };

  const handleSavePrice = async (product: Product) => {
    const paise = Math.round(newPriceRupees * 100);
    if (paise <= 0) return;

    await (supabase as any)
      .from('products')
      .update({ basePricePaise: paise })
      .eq('id', product.id);

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, basePricePaise: paise } : p))
    );
    setEditingPriceId(null);
    showNotification(`Updated price for ${product.name} to ₹${newPriceRupees}`);
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  const categories = ['ALL', 'CHAI', 'COFFEE', 'TEA', 'COLD', 'BITES', 'SWEETS'];

  const filtered = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'ALL' || p.categorySlug.toUpperCase() === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const availableCount = products.filter((p) => p.isAvailable).length;
  const soldOutCount = products.filter((p) => !p.isAvailable).length;

  return (
    <div className="min-h-screen bg-[var(--linen)] text-[var(--dark-roast)] font-sans">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[var(--parchment)] border-b border-[var(--warm-border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="inline-flex items-center text-xs tracking-wider uppercase text-[var(--clay)] hover:text-[var(--terracotta)] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Live KDS Board
            </Link>
            <span className="text-[var(--warm-border)]">|</span>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-black text-xl tracking-tight text-[var(--dark-roast)]">
                CHAIWALA
              </span>
              <span className="bg-[var(--terracotta)]/15 text-[var(--terracotta)] text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                Menu Management
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center text-xs text-[var(--clay)] hover:text-[var(--dark-roast)] underline underline-offset-4"
            >
              Customer Store ↗
            </Link>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[var(--dark-roast)]">{user?.email}</p>
              <p className="text-[10px] text-[var(--clay)]">Catalog Admin</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 text-[var(--clay)] hover:text-[var(--terracotta)] rounded-lg hover:bg-[var(--linen)] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast alert */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-[var(--terracotta)] text-white font-medium text-sm flex items-center justify-between shadow-md"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="text-white/80 hover:text-white text-xs underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Header & Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[var(--dark-roast)]">
              Menu & Availability Catalog
            </h1>
            <p className="text-sm text-[var(--clay)] mt-1">
              Toggle instant 86’d inventory status and update menu base pricing. Changes take effect across all customer carts immediately.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-xl px-4 py-2 flex items-center space-x-3 shadow-xs">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--clay)]">Available</p>
                <p className="font-serif text-xl font-bold text-emerald-700">{availableCount}</p>
              </div>
              <div className="h-8 w-px bg-[var(--warm-border)]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--clay)]">86’d / Sold Out</p>
                <p className="font-serif text-xl font-bold text-red-700">{soldOutCount}</p>
              </div>
              <div className="h-8 w-px bg-[var(--warm-border)]" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--clay)]">Total</p>
                <p className="font-serif text-xl font-bold text-[var(--dark-roast)]">{products.length}</p>
              </div>
            </div>

            <button
              onClick={loadProducts}
              className="p-3 bg-[var(--parchment)] border border-[var(--warm-border)] hover:border-[var(--terracotta)] text-[var(--clay)] hover:text-[var(--dark-roast)] rounded-xl transition-colors shadow-xs"
              title="Refresh Catalog"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Bar: Category filter & Search */}
        <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                  selectedCategory === cat
                    ? 'bg-[var(--terracotta)] text-white shadow-xs'
                    : 'bg-[var(--linen)] text-[var(--clay)] hover:text-[var(--dark-roast)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clay)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes or description..."
              className="w-full bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[var(--terracotta)] text-[var(--dark-roast)] placeholder-[var(--clay)]"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--linen)] border-b border-[var(--warm-border)] text-[10px] uppercase font-bold tracking-widest text-[var(--clay)]">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category / Moods</th>
                  <th className="py-3.5 px-4">Prep Time</th>
                  <th className="py-3.5 px-4">Base Price</th>
                  <th className="py-3.5 px-4">Availability (86 Control)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--warm-border)]">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className={`transition-colors hover:bg-[var(--linen)]/50 ${
                      !product.isAvailable ? 'bg-red-50/40' : ''
                    }`}
                  >
                    {/* Item Name & Thumb */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.imagePath}
                          alt={product.imageAlt || product.name}
                          className="w-12 h-14 rounded-xl object-cover border border-[var(--warm-border)] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-serif font-bold text-[var(--dark-roast)]">
                              {product.name}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--clay)] line-clamp-1 max-w-xs mt-0.5">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Mood */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1 items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--clay)] bg-[var(--linen)] px-2 py-0.5 rounded-full border border-[var(--warm-border)]">
                          {product.categorySlug}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.themes.map((th) => (
                            <span
                              key={th.themeSlug}
                              className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--dark-roast)]/10 text-[var(--dark-roast)]"
                            >
                              {th.themeSlug}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Prep Time */}
                    <td className="py-4 px-4 font-mono text-xs text-[var(--clay)]">
                      {product.prepMinutes} min
                    </td>

                    {/* Base Price */}
                    <td className="py-4 px-4">
                      {editingPriceId === product.id ? (
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-serif font-bold text-[var(--dark-roast)]">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={newPriceRupees}
                            onChange={(e) => setNewPriceRupees(Number(e.target.value))}
                            className="w-20 bg-[var(--linen)] border border-[var(--terracotta)] rounded-lg px-2 py-1 text-xs font-mono font-bold text-[var(--dark-roast)]"
                          />
                          <button
                            onClick={() => handleSavePrice(product)}
                            className="p-1.5 bg-[var(--terracotta)] text-white rounded-lg hover:bg-[#85321D]"
                            title="Save"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-base text-[var(--dark-roast)]">
                            ₹{Math.round(product.basePricePaise / 100)}
                          </span>
                          <button
                            onClick={() => handleStartEditPrice(product)}
                            className="text-[var(--clay)] hover:text-[var(--terracotta)] p-1 transition-colors cursor-pointer"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleAvailability(product)}
                        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          product.isAvailable
                            ? 'bg-[#EDF7ED] text-[#1B5E20] border border-[#2E7D32]/30 hover:bg-[#E2F0E2]'
                            : 'bg-red-50 text-red-800 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        {product.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                            <span>AVAILABLE</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>86’D / SOLD OUT</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* View in Store */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/menu/${product.slug}`}
                        target="_blank"
                        className="text-xs text-[var(--clay)] hover:text-[var(--terracotta)] underline underline-offset-2"
                      >
                        Preview ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminMenuPage;
