run: 
docker-compose up --build 
and go to http://localhost:3000/todos

Tests for backend
docker-compose exec backend npm test

Tests for frontend
docker-compose exec frontend npm test

