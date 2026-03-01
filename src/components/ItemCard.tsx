import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Item, getCategoryGradient } from '@/data/items';

const ItemCard = ({ item }: { item: Item }) => {
  return (
    <Link to={`/item/${item.id}`} className="block group">
      <div className="card-elevated rounded-lg overflow-hidden bg-card">
        <div className={`aspect-[3/4] ${getCategoryGradient(item.category)} relative overflow-hidden`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-3xl font-display font-bold text-primary-foreground drop-shadow-lg">{item.title[0]}</span>
            <span className="text-xs font-medium text-primary-foreground/80 mt-1 uppercase tracking-wider">{item.genre}</span>
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="text-xs font-semibold text-primary-foreground">{item.rating}/5</span>
            </div>
          </div>
          {item.offers && item.offers.length > 0 && (
            <div className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Offer
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{item.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{item.genre} • {item.duration}</p>
          <p className="text-sm font-bold text-primary mt-1">₹{item.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
