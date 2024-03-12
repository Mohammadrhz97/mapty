'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.Cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed;
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  #map;
  #mapE;
  #workoutArr = [];
  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert('could not get your location!');
      }
    );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(e) {
    this.#mapE = e;
    const { lat } = e.latlng;
    const { lng } = e.latlng;
    form.classList.remove('hidden');
    inputDistance.focus();
    L.marker([lat, lng]).addTo(this.#map);
  }

  _newWorkout(e) {
    e.preventDefault();
    const dataValidation = (...input) => {
      return input.every(inp => Number.isFinite(inp));
    };
    const isPositive = (...input) => {
      return input.every(inp => inp > 0);
    };

    //get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapE.latlng;
    let workoutFnc;

    //if workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //check if data is valid
      if (
        !dataValidation(distance, duration, cadence) ||
        !isPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be Positive number!');
      workoutFnc = new Running([lat, lng], distance, duration, cadence);
    }

    //if workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //check if data is valid
      if (
        !dataValidation(distance, duration, elevation) ||
        !isPositive(distance, duration)
      )
        return alert('Inputs have to be Positive number!');
      workoutFnc = new Cycling([lat, lng], distance, duration, elevation);
    }

    //add new object to workout array
    this.#workoutArr.push(workoutFnc);

    //render workout on map as marker
    this._renderWorkoutMarker(workoutFnc);

    console.log(workoutFnc);
  }

  //render workout on map as marker
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.distance}`)
      .openPopup();
  }

  //render workout on list

  //hide form + clear inpur form
}

const app = new App();
