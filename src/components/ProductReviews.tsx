import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  user_id: string;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("product_reviews").insert({
      user_id: user.id,
      product_id: productId,
      rating,
      title,
      content,
      author_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "Anonymous",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      setTitle("");
      setContent("");
      setRating(5);
      setShowForm(false);
      fetchReviews();
    }

    setIsSubmitting(false);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const StarRating = ({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            size={readonly ? 16 : 24}
            className={`${star <= value ? "fill-foreground text-foreground" : "text-border"} transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <section className="mt-16 pt-16 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <StarRating value={Math.round(Number(averageRating))} readonly />
            <span className="font-body text-sm text-muted-foreground">
              {averageRating} out of 5 ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
        {!showForm && (
          <motion.button
            onClick={() => setShowForm(true)}
            className="btn-outline"
            whileTap={{ scale: 0.98 }}
          >
            Write a Review
          </motion.button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-12 p-6 border border-border"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              Review {productName}
            </h3>

            <div className="mb-4">
              <label className="font-body text-xs tracking-widest uppercase text-foreground mb-2 block">
                Your Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="mb-4">
              <label className="font-body text-xs tracking-widest uppercase text-foreground mb-2 block">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
                placeholder="Sum up your experience"
              />
            </div>

            <div className="mb-6">
              <label className="font-body text-xs tracking-widest uppercase text-foreground mb-2 block">
                Your Review
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[120px] border-border bg-transparent font-body text-sm text-foreground focus:border-foreground"
                placeholder="Tell others about your experience with this product"
              />
            </div>

            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-filled flex items-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                Submit Review
              </motion.button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 border border-border">
          <p className="font-body text-muted-foreground">
            No reviews yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-border"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <User size={20} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">
                      {review.author_name}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readonly />
              </div>
              <h4 className="font-body text-base font-medium text-foreground mb-2">
                {review.title}
              </h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {review.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
