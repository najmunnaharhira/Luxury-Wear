import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  product_id: number;
  author_name: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", id);

    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Review deleted" });
    } else {
      toast({ title: "Error", description: "Could not delete review", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="font-display text-3xl font-semibold text-foreground mb-8">Reviews</h2>
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl font-semibold text-foreground">Reviews</h2>
        <span className="font-body text-sm text-muted-foreground">{reviews.length} total</span>
      </div>

      {reviews.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-body text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-border p-5 bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-body text-sm font-medium text-foreground">{review.author_name}</span>
                    <span className="font-body text-xs text-muted-foreground">·</span>
                    <span className="font-body text-xs text-muted-foreground">
                      Product #{review.product_id}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">·</span>
                    <span className="font-body text-xs text-muted-foreground">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < review.rating ? "fill-foreground text-foreground" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <h4 className="font-body text-sm font-medium text-foreground mb-1">{review.title}</h4>
                  <p className="font-body text-sm text-muted-foreground">{review.content}</p>
                </div>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
