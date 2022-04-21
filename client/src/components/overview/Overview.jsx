import React from 'react';
import ImageGallery from './ImageGallery.jsx';
import ProductInformation from './ProductInformation.jsx';
import StyleSelector from './StyleSelector.jsx';
import AddToCart from './AddToCart.jsx';
import {headers, uri} from '../../../../config.js';
import axios from 'axios';
import './Overview.css';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 64620,
      information: {},
      styles: [],
      selectedStyle: {},
      selectedSKU: '',
      selectedSize: '',
      selectedQuantity: '',
      maxQuantity: '',
      ratings: '',
      reviewsCount: '',
      slideIndex: 0,
      thumbnailPos: 0,
      thumbnailIndex: 0
    }
  }

  componentDidMount() {
    let id = this.state.id;
    this.getProductInformation(id);
    this.getProductStyles(id);
    this.getProductRatings(id);
  }

  componentDidUpdate() {
    const slideIndex = this.state.slideIndex;
    this.showSlides(slideIndex);
  }

  getProductInformation = (id) => {
    axios.get(`/products/${id}`)
      .then((res) => {
        const information = res.data;
        this.setState({ information });
      })
      .catch((err) => {
        console.error('getProductInformation', err);
      })
  }

  getProductStyles = (id) => {
    axios.get(`/products/${id}/styles`)
      .then((res) => {
        const styles = res.data.results;
        this.setState({ styles });
      })
      .catch((err) => {
        console.error('getProductStyles', err);
      })
  }

  getProductReviews = (id) => {
    aixos.get(`/reviews/?sort='newest'&product_id=${id}`)
  }

  getProductRatings = (id) => {
    axios.get(`/reviews/meta/?product_id=${id}`)
      .then((res) => {
        const reviewsCount = Number(res.data.ratings['1']) + Number(res.data.ratings['2']) + Number(res.data.ratings['3']) + Number(res.data.ratings['4']) + Number(res.data.ratings['5']);
        const ratings = ((Number(res.data.ratings['1']) * 1 + Number(res.data.ratings['2']) * 2 + Number(res.data.ratings['3']) * 3 + Number(res.data.ratings['4']) * 4 + Number(res.data.ratings['5']) * 5) / reviewsCount).toFixed(1);
        this.setState({ ratings, reviewsCount });
      })
      .catch((err) => {
        console.error('getProductRatings', err);
      })
  }

  onStyleClick = (e) => {
    const checkboxes = document.getElementsByClassName("checkbox");
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }
    const styles = [...this.state.styles];
    const selectedCheckbox = e.target;
    selectedCheckbox.checked = true;
    const selectedStyle = styles[selectedCheckbox.id];
    this.setState({
      selectedStyle,
      selectedSKU: '',
      maxQuantity: '',
      selectedQuantity: '',
      selectedSize: '',
      slideIndex: 0
    });
  }

  onSizeChange = (e) => {
    const selectedSKU = e.target.value;
    const selectedStyle = {...this.state.selectedStyle};
    const selectedSize = selectedStyle.skus[selectedSKU].size;
    const maxQuantity = selectedStyle.skus[selectedSKU].quantity;
    this.setState({selectedSKU, selectedSize, maxQuantity});
    const sizeDropdown = document.getElementById('sizeDropdown');
    sizeDropdown.removeAttribute('size');
    const sizeAlert = document.getElementsByClassName('sizeAlert');
    sizeAlert[0].setAttribute('hidden', 'hidden');
  }

  onQuantityChange = (e) => {
    const selectedQuantity = e.target.value;
    this.setState({selectedQuantity})
  }

  onAddToCartClick = (e) => {
    const selectedStyle = { ...this.state.selectedStyle };
    const selectedSize = this.state.selectedSize;
    if (Object.keys(selectedStyle).length > 0 && selectedSize === '') {
      const sizeAlert = document.getElementsByClassName('sizeAlert');
      sizeAlert[0].removeAttribute('hidden');
      const sizeDropdown = document.getElementById('sizeDropdown');
      // const sizeSelection = Object.keys(selectedStyle.skus).length || 1;
      // sizeDropdown.setAttribute('size', `${sizeSelection}`);
      sizeDropdown.setAttribute('size', `3`);
    }
  }

  showSlides = (slideIndex) => {
    const slides = document.getElementsByClassName('mySlides');
    const thumbnails = document.getElementsByClassName('thumbnail-div');
    if (slides.length > 0) {
      slides.forEach(slide => slide.style.display = 'none');
      thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
      slides[slideIndex].style.display = 'block';
      thumbnails[slideIndex].classList.add('active');
    }
  }

  onPrevClick = (e) => {
    let slideIndex = this.state.slideIndex - 1;
    const slides = document.getElementsByClassName('mySlides');
    if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    };
    this.setState({slideIndex});
  }

  onNextClick = (e) => {
    let slideIndex = this.state.slideIndex + 1;
    const slides = document.getElementsByClassName('mySlides');
    if (slideIndex > slides.length - 1) {
      slideIndex = 0;
    };
    this.setState({slideIndex});
  }

  onThumbnailClick = (e) => {
    const slideIndex = e.target.id;
    this.setState({slideIndex});
  }

  onUpClick = (e) => {
    let thumbnailPos = this.state.thumbnailPos + 110;
    let thumbnailIndex = this.state.thumbnailIndex - 1;
    this.setState({thumbnailPos, thumbnailIndex});
  }

  onDownClick = (e) => {
    let thumbnailPos = this.state.thumbnailPos - 110;
    let thumbnailIndex = this.state.thumbnailIndex + 1;
    this.setState({thumbnailPos, thumbnailIndex});
  }
  render() {
    return (
      <div id="overview" className="container1">
        <div className="container1-1">
          <ImageGallery styles={this.state.styles} selectedStyle={this.state.selectedStyle} thumbnailIndex={this.state.thumbnailIndex} thumbnailPos={this.state.thumbnailPos} onPrevClick={this.onPrevClick} onNextClick={this.onNextClick} onThumbnailClick={this.onThumbnailClick} onUpClick={this.onUpClick} onDownClick={this.onDownClick} />
        </div>
        <div className="container1-2">
        <div className="container1-2-1">
          <ProductInformation information={this.state.information} ratings={this.state.ratings} reviewsCount={this.state.reviewsCount} />
          <br></br>
          <br></br>
        </div>
        <div className="container1-2-2">
          <StyleSelector styles={this.state.styles} selectedStyle={this.state.selectedStyle} onStyleClick={this.onStyleClick} />
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </div>
        <div className="container1-2-3">
          <AddToCart selectedStyle={this.state.selectedStyle} selectedSKU = {this.state.selectedSKU} maxQuantity = {this.state.maxQuantity} selectedQuantity={this.state.selectedQuantity} selectedSKU={this.state.selectedSKU} onSizeChange={this.onSizeChange} onQuantityChange={this.onQuantityChange} onAddToCartClick={this.onAddToCartClick} />
          <br></br>
        </div>
        </div>
      </div>
    );
  }
}

export default Overview;