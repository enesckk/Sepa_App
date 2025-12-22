const { calculateDistance, calculateDistanceInMeters } = require('../../utils/distance');

describe('Distance Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points in kilometers', () => {
      // Gaziantep coordinates
      const lat1 = 37.0662;
      const lon1 = 37.3833;

      // Istanbul coordinates
      const lat2 = 41.0082;
      const lon2 = 28.9784;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      // Distance should be approximately 850-900 km
      expect(distance).toBeGreaterThan(800);
      expect(distance).toBeLessThan(1000);
    });

    it('should return 0 for same coordinates', () => {
      const lat = 37.0662;
      const lon = 37.3833;

      const distance = calculateDistance(lat, lon, lat, lon);

      expect(distance).toBeCloseTo(0, 2);
    });

    it('should calculate short distances correctly', () => {
      // Two close points in Gaziantep
      const lat1 = 37.0662;
      const lon1 = 37.3833;
      const lat2 = 37.0700;
      const lon2 = 37.3900;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);

      // Should be approximately 0.5-1 km
      expect(distance).toBeGreaterThan(0.3);
      expect(distance).toBeLessThan(2);
    });
  });

  describe('calculateDistanceInMeters', () => {
    it('should calculate distance in meters', () => {
      const lat1 = 37.0662;
      const lon1 = 37.3833;
      const lat2 = 37.0700;
      const lon2 = 37.3900;

      const distance = calculateDistanceInMeters(lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(300);
      expect(distance).toBeLessThan(2000);
    });

    it('should return 0 for same coordinates', () => {
      const lat = 37.0662;
      const lon = 37.3833;

      const distance = calculateDistanceInMeters(lat, lon, lat, lon);

      expect(distance).toBeCloseTo(0, 0);
    });
  });
});

