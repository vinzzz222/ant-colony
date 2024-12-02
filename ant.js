class Ant {
    constructor(cities, pheromones) {
        this.cities = cities;
        this.pheromones = pheromones;
        this.path = this.generatePath();
        this.fitness = this.calculateFitness();
    }

    generatePath() {
        const unvisited = [...this.cities];
        const path = [];
        let current = unvisited.splice(0, 1)[0]; 
        path.push(current.name);

        while (unvisited.length > 0) {
            const nextCity = unvisited[Math.floor(Math.random() * unvisited.length)];
            unvisited.splice(unvisited.indexOf(nextCity), 1);
            path.push(nextCity.name);
        }

        return path;
    }

    calculateFitness() {
        let totalDistance = 0;
        for (let i = 0; i < this.path.length - 1; i++) {
            const city1 = this.cities.find(city => city.name === this.path[i]);
            const city2 = this.cities.find(city => city.name === this.path[i + 1]);
            totalDistance += this.calculateDistance(city1, city2);
        }

        const startCity = this.cities.find(city => city.name === this.path[0]);
        const endCity = this.cities.find(city => city.name === this.path[this.path.length - 1]);
        totalDistance += this.calculateDistance(startCity, endCity);

        return totalDistance;
    }

    calculateDistance(city1, city2) {
        const R = 6371;
        const dLat = this.degToRad(city2.lat - city1.lat);
        const dLon = this.degToRad(city2.lon - city1.lon);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.degToRad(city1.lat)) * Math.cos(this.degToRad(city2.lat)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }
}

class TSP {
    constructor(cities) {
        this.cities = cities;
        this.pheromones = Array(cities.length).fill(Array(cities.length).fill(1));
        this.ants = [];
        this.bestFitness = Infinity;
        this.bestPath = [];
        this.initAnts();
    }

    initAnts() {
        for (let i = 0; i < 10; i++) {
            this.ants.push(new Ant(this.cities, this.pheromones));
        }
    }

    runIteration() {
        this.ants.forEach(ant => {
            ant.path = ant.generatePath();
            ant.fitness = ant.calculateFitness();
        });
        this.updateBestPath();
    }

    updateBestPath() {
        this.ants.forEach(ant => {
            if (ant.fitness < this.bestFitness) {
                this.bestFitness = ant.fitness;
                this.bestPath = ant.path;
            }
        });
    }
}

export { TSP };
