const db = require('../config/db');
const getDistance = require('../utils/getDistance').getDistance; 

// addSchool function to add a new school to the database
exports.addSchool = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

  
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  
    try {
      const [result] = await db.promise().query(query, [name, address, latitude, longitude]);
      res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
// listSchools function to retrieve all schools from the database and calculate distance from user location
exports.listSchools = async (req, res) => {
    const { latitude: userLat, longitude: userLng } = req.query;
  
    if (!userLat || !userLng) {
      return res.status(400).json({ message: 'User latitude and longitude are required.' });
    }
  
    const query = 'SELECT * FROM schools';
  
    try {
      const [results] = await db.promise().query(query);
  
        const withDistance = results.map(school => {
        const distance = getDistance(parseFloat(userLat), parseFloat(userLng), school.latitude, school.longitude);
        return { ...school, distance };
      });
  
      withDistance.sort((a, b) => a.distance - b.distance);
      res.status(200).json(withDistance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


