import React, { useEffect, useState } from 'react';
import './App.css';
import { send } from 'emailjs-com';
// import  Modal from'./Component/Modal';
import  Login from'./Component/Login';
//import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams} from 'react-router-dom';

function App() {
  const [plants, setPlants] = useState([]);
  const [status, setStatus] = useState("");
  const formInitialState = {
    plantId: "", 
    plantName: "", 
    username: "", 
    wateringFrequency: "", 
    isWatered: "", 
    lastWatered:"" 
  };
  const [formData, setFormData] = useState(formInitialState); 
  const [openCard, setOpenCard] = useState(false);
  const [toSend, setToSend] = useState({
    from_name: '',
    to_name: '',
    message: '',
    reply_to: '',
  }); 

  const getPlants = () => {
    fetch('/index/plants')
      .then((response) => response.json())
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

  // REGISTER & LOGIN
  
  function register(newUser) {
    fetch('/users/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })
      .then(result => setStatus(result))
      .catch(err => console.log(err))
  }

  function handleInputChange(event) {
    let { name, value } = event.target;
    setFormData({...formData, [name]: value});
  };

  function handleSubmit(event) {
    event.preventDefault();
    addPlant(formData.plantName, formData.username, formData.wateringFrequency);
    // setPlants((state) => [...state]);
    setFormData(formInitialState);
  };

  const addPlant = async (plantName, username, wateringFrequency) => {
    // console.log(plantName)
    // console.log(plants);
    let plant = { plantName, username, wateringFrequency };
    let options = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(plant),
    };

    try {
      await fetch("/index/plants", options);
      getPlants();
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  // const handleWater = (plantId) => {
  //   let timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' });
  //   console.log(timestamp);
  //   addWater(plantId);
  // };

  const addWater = async (id) => {
    console.log(id);
    // let water = { lastWatered };
    // let options = {
    //   method: "PUT",
    //   headers: { 
    //     "Content-Type": "application/json" 
    //   }
    //   body: JSON.stringify(water),
    // };

    try {
      await fetch(`/index/plants/${id}`, { method: "PUT" });
      getPlants();
    } catch (err) {
      console.log("Network error:", err);
    }
  };

  // const addTimestamp = async (plantName, lastWatered) => {
  //   //console.log(plantName)
  //   // console.log(plants);
  //   let watered = { plantName, lastWatered };
  //   let options = {
  //     method: "POST",
  //     headers: { 
  //       "Content-Type": "application/json" 
  //     },
  //     body: JSON.stringify(watered),
  //   };

  //   try {
  //     await fetch("/plants", options);
  //     getPlants();
  //   } catch (err) {
  //     console.log("Network error:", err);
  //   }
  // };

  const onSubmit = (e) => {
      e.preventDefault();
      send(
        'service_enfgb9f',
        'template_v2zh8ce',
        toSend,
        'user_riJqcWvN7Sz9EZ1Ap7MgO'
      )
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
        })
        .catch((err) => {
          console.log('FAILED...', err);
        });
      };
    

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };


  // SCHEDULED FUNCTION CALL TO CHECK IF PLANTS ARE WATERED

  //with useEffect, you can make it run a function every X time with setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Daily checkup!");
      // console.log(plants);
      for (let i=0; i<plants.length; i++) {
        let hoursDifference = getInterval(plants[i].lastWatered);
        if(hoursDifference > plants[i].wateringFrequency) {
            fetch(`/index/plants2/${plants[i].plantId}`, { method: "PUT" })
            .then(result => result.json())
            .then (plants => setPlants(plants))
            .catch(err => console.log("Network error:", err))
        }
      }
    }, 300000);
    return () => clearInterval(interval);
  }, [plants]);


  //1min in ms = 60000
  //24h in ms = 43200000

  const getInterval = (originDate) => {
    let endDate = new Date();
    originDate = new Date(originDate);
    let timeDifference = endDate.getTime() - originDate.getTime();
    return timeDifference / (1000 * 3600 * 24);
  }

  // //alternative: node-cron lets you schedule any function to a designated set of time
  // //issues: React doesnt support this feature, so vanilla cron-job doesnt work
  // var CronJob = require('cron').CronJob;
  // var job = new CronJob('15 20 * * * *', function() {
  //   console.log("Scheduled function running!")
  // }, null, true, 'America/Chicago');
  // job.start();

  return (
    <div className="parent">
      {/* <Router>
        <div>
         <nav>
           <ul>
            <li>
              <Link to="/">Home</Link>
           </li>
            <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/hutches">Hutches</Link>
        </li>
      </ul>
    </nav>

      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/users">
          <Users />
        <Route path="/hutches">
        </Route>
          <Hutches />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router> */}

      <div className="p-3 mb-2 bg-success text-white">
        <h1 className="title"> Feed Me, Seymore </h1>
      </div>
              
      <Login onRegister={newUser => register(newUser)}/>

      {/* ADD PLANTS FORM */}
      <form className="grid-container"  onSubmit={handleSubmit}>
        <fieldset className="form-container" id="plant-container">
          <legend>
            <h3>Add New Plants to your Collection</h3>
          </legend> <br />

          <label className="form-input">
            <span>New Plant:</span>
            <input
            type="text"
            onChange={e => handleInputChange(e)}
            name="plantName"
            value={ formData.plantName }
            placeholder="Your plant here"
            />
          </label>

          <label className="form-input">
            <span>Watering Frequency:</span>
            <input 
            type="text"
            onChange={handleInputChange}
            name="wateringFrequency"
            value={ formData.wateringFrequency }
            placeholder="Days until water" />
          </label>
          
          <label className="form-input">
            <span>Username:</span>
            <input
            type="text"
            onChange={e => handleInputChange(e)}
            name="username"
            value={ formData.username }
            placeholder="Username here"
            /> 
          </label> <br />

        {/* <label className="url">Plant Photo</label>
          <input
          onChange={e => handleInputChange(e)}
          name="url"
        //  value={ formData.url }
          placeholder="URL here"
          />  */}

          <button className="submit-btn" type="submit" id="plant-btn">
            Add Plant
          </button>
        </fieldset>
      </form>
        
       
      <div className="card-deck">
        {plants.map(plant => (
          <div key ={plant.plantId} className="card" id="card">
              <div className="card-body shadow-border-0">
                <h5 className="card-title">{ plant.plantName }</h5>               
                {/* <input type="checkbox" id= "myCheck" onChange={handleClick()}/>  */}
                <button type="submit" className="watered-button" onClick={() => addWater(plant.plantId)}>Water!</button>
                <div className="card-header">
                  Last Watered: { plant.lastWatered.slice(0, 10) } <br />
                  Needs water every { plant.wateringFrequency } day(s)!
                </div>
              </div>
          </div>  
          
      ))}

      </div>

      {/* BUTTON TO OPEN MODAL */}
      {/* <div>
        <button className="openModalBtn"
          onClick={() =>{
          setOpenCard(true);
        }}>
        Open
        </button>
        { openCard && <Modal closeCard={setOpenCard} />}
      </div> */}

      {/* EMAIL FORM */}
      <form className="grid-container" onSubmit={onSubmit}>
        {/* <label className="from">From:</label>
        <input
          type='text'
          name='from_name'
          placeholder='from name'
          value={toSend.from_name}
          onChange={handleChange}
        /> */}
        <fieldset className="form-container">
          <legend>
            <h3>Send an Email Reminder</h3>
          </legend>

          <label className="form-input">
            <span>To Whom:</span>
            <input
              type="text"
              name="to_name"
              placeholder="Recipient name"
              value={toSend.to_name}
              onChange={handleChange}
            />
          </label> <br/>
          
          <label className="form-input">
            <span>Your Email:</span>
            <input
              type='text'
              name='reply_to'
              placeholder='Receiver email'
              value={toSend.reply_to}
              onChange={handleChange}
            />
          </label>
          
          {/* <label className="message">Your Reminder:</label>
          <input id="message"
            className="message-box"
            type='text'
            name='message'
            placeholder='Your message'
            value={toSend.message}
            onChange={handleChange}
          /> <br/> */}
          
          <button className="submit-btn" type='submit'>
            Send Reminder
          </button>
        </fieldset>
      </form>
    </div>
  )};

export default App;
