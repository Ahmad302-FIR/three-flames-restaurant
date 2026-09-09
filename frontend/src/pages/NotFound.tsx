import React from 'react';
import { Link } from 'react-router-dom';
import { FlameIcon } from '../components/common/FlameIcon';
import { Button } from '../components/common/Button';
import { Home, Utensils } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1C1815] pt-32 pb-20 flex items-center justify-center text-[#F3EDE5] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#28221D] border border-[#51463D] flex items-center justify-center mx-auto text-[#C97845] shadow-2xl">
          <FlameIcon size={44} />
        </div>

        <h1 className="text-6xl font-black font-heading text-[#C97845]">404</h1>
        <h2 className="text-2xl font-bold font-heading text-white">Page Not Found</h2>
        <p className="text-xs text-[#BDB1A5] leading-relaxed">
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
