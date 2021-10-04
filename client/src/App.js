
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  let [plants, setPlants] = useState([]);
  const formInitialState = {plantId: "", plantName: "", username: "", wateringFrequency: "", isWatered: "", lastWatered:""};
  let [formData, setFormData] = useState(formInitialState);

  const getPlants = () => {
    fetch('/:plants')
      .then((res) => res.json())
      .then((plants) => {
         setPlants(plants);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(()=> {
    getPlants();
}, []);

  function handleInputChange(event) {
    // let newId = plants.length;
    //newPlant.id = newId;
    let { name, value /*,username, value2*/ } = event.target;
    setFormData({...formData, [name]: value /*,[username]: value2*/});
  }
    // add newPlant to State
    // setPlants((state) => [...state, newPlant]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("string");
    addPlant(formData.name/*, formData.username*/);
    setPlants(formInitialState);
  };

  const addPlant = async (plantName/*, username*/) => {
    console.log(plantName)
    let plant = { plantName/*, username*/ };
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(plant),
    };

    try {
      await fetch("/students", options);
      getPlants();
    } catch (err) {
      console.log("Network error:", err);
    }
};

//     try {
//       let response = await fetch("/plants", options);
//       if (response.ok) {
//         let plants = await response.json();
//         setPlants(plants);
//       }
//     } catch (err) {
//       console.log("Network error:", err);
//     }
// };

//   const addPlant = async (name) => {
//     let plant = { name/*, username*/ };
//     let options = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(plant),
//     };

  return (
    <div className="App p-3 mb-2 bg-info text-dark">
    <h3 > Build Your Plant Hutch </h3><header className="button-container"> 
      <form>
       <label className="plantadd">New Plant</label>
       <input
       type= "text"
       onChange={e => handleInputChange(e)}
       name="plantName"
       value={ formData.plantName }
       placeholder="Your plant here"
       />

        <button onSubmit={handleSubmit} type="submit"
        className="button" 
        > Add Plant
        </button>
        </form>

        <ul>
          {plants.map((p) => (
          <li key={p.id}>
            {p.id}
            {p.plantName}
            </li>
          ))}
        </ul>
        
        
    </header>  
    
    </div>
  );
}

export default App;
