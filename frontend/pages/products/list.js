import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import { PropagateLoader } from 'react-spinners';
import ListPackages from '@/components/products/list/list-packages';
import ListPrixfixe from '@/components/products/list/list-prixfixe';
import ListAlacarte from '@/components/products/list/list-alacarte';
import ListRoom from '@/components/products/list/list-room';
import ListService from '@/components/products/list/list-service';

function List() {
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState('package');

  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    setType(query.type);
    setIsLoading(false);
  }, [query]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-70">
        <PropagateLoader color="#0860ae" size={10} />
      </Container>
    );
  }

  return (
    <div>
      {(() => {
        switch (type) {
          case 'package':
            return <ListPackages />;

          case 'prixfixe':
            return <ListPrixfixe />;

          case 'alacarte':
            return <ListAlacarte />;

          case 'room':
            return <ListRoom />;

          case 'service':
            return <ListService />;

          default:
            setTimeout(() => {
              return <div className="error-message">Something went wrong</div>;
            }, 1000);
        }
      })()}
    </div>
  );
}

export default List;
