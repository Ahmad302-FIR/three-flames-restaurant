import React from 'react';
import { Link } from 'react-router-dom';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';
import { Home, Utensils } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDFC] pt-32 pb-20 flex items-center justify-center text-[#25201D] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center mx-auto mb-2">
          <img src="/akr-logo.png" alt="AKR" className="h-16 w-auto object-contain" />
        </div>

        <h1 className="text-6xl font-black font-heading text-[#B85C38]">404</h1>
        <h2 className="text-2xl font-bold font-heading text-[#25201D]">Page Not Found</h2>
        <p className="text-xs text-[#6F6761] leading-relaxed">
          The flavor trail ends here. The dish or page you are searching for might have been moved or removed from our menu.
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home size={16} />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="secondary" size="md" leftIcon={<Utensils size={16} />}>
              Explore Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
