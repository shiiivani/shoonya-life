import "./App.css";
import main from "./images/main.jpg";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats"
        );
        setCards(response.data);
      } catch (error) {
        console.log(error, "Error in fetch card information");
      }
    };
    fetchData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  const filterByDate = (card) => {
    if (!selectedDateRange) return true;

    const [startYear, endYear] = selectedDateRange.split("-").map(Number);
    const cardYear = new Date(formatDate(card.date)).getFullYear();

    return cardYear >= startYear && cardYear <= endYear;
  };

  const filterByType = (card) => {
    return selectedType
      ? card.tag.some((tag) => tag.toLowerCase() === selectedType.toLowerCase())
      : true;
  };

  const filterBySearch = (card) => {
    return card.title.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const filteredCards = cards.filter((card) => {
    return filterByDate(card) && filterByType(card) && filterBySearch(card);
  });

  return (
    <div className="App">
      <div className="nav">
        <h1>Wellnes Retreats</h1>
      </div>

      <div className="outer-container">
        <div className="header-container">
          <img src={main} alt="A Person Meditating" />
          <h2>Discover Your Inner Peace</h2>
          <p>
            Join us for a series of wellness retreats designed to help you find
            tranquility and rejuvenation.
          </p>
        </div>

        <div className="filter-container flex items-center justify-between">
          <div className="flex items-center">
            <select
              name="date"
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="" defaultValue>
                Filter by Date
              </option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
            <select
              name="type"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="" defaultValue>
                Filter by Type
              </option>
              <option value="Yoga">Yoga</option>
              <option value="Meditation">Meditation</option>
              <option value="Detox">Detox</option>
            </select>
          </div>
          <input
            name="search"
            type="text"
            placeholder="Search retreats by title"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="card-container flex justify-between">
          {filteredCards
            .slice(currentIndex, currentIndex + 3)
            .map((card, index) => (
              <div className="card" key={index}>
                <div className="card-img">
                  <img src={card.image} alt={card.title} width="100%" />
                </div>
                <h3 className="heading">{card.title}</h3>
                <p className="description">{card.description}</p>
                <p className="date">Date: {formatDate(card.date)}</p>
                <p className="location">Location: {card.location}</p>
                <p className="price">Price: ₹{card.price}</p>
              </div>
            ))}
        </div>
        <div className="btn-container text-center mt-5">
          <button className="prev" onClick={prevSlide}>
            Previous
          </button>
          <button className="next" onClick={nextSlide}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
