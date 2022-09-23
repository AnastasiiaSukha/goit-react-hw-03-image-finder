import React, { Component } from "react";
import Searchbar from "./Searchbar/Searchbar";
import { getImages, quantityPerPage } from "./services/api";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader.js";
import { Container } from "App.styled";
import Modal from "./Modal/Modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default class App extends Component {
 
  state = {
    search: "",
    pictures: [],
    page:1,
    isLoading: false,
    error:'',
    status: 'idle',
    imageLink: null,
  }

  notify = () => toast("Sorry, there is no images with this name!");

 
  async componentDidUpdate(_, prevState) {
    const { search, page } = this.state;


    if (search !== prevState.search|| page !== prevState.page) {
      this.setState({ status: 'pending', isLoading: true});

      try {
        const response = await getImages(search, page);

        if (response.total === 0) {
          this.notify();
          this.setState({ pictures: [] });
        }

        this.setState(prevState => ({
          status: 'resolved',
          pictures: [...prevState.pictures, ...response.hits],
        }));
      } catch (error) {
        this.setState({ status: 'rejected', error: 'Sorry, something happened, please try again later' });
      }
    }   
  }


  handleSubmit = text => {
    this.setState({
      page:1,
      search: text,
      pictures:[],

    })
  }

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  
  showModal = link => {
    this.setState({
      imageLink: `${link}`,
    }
     
    )
  }

  closeModal = () => {
    this.setState({
      imageLink: null,
    })
  }
  

  render() {
    const { pictures, status, error, imageLink, page} = this.state;
    const lastPictures = (pictures.length / quantityPerPage) < page;


    return (
      <Container>
        <Searchbar onSubmit={this.handleSubmit} />
        {status === 'pending' && <Loader />}
        {status === 'rejected' && console.log(error)}
        {pictures.length > 0 && (<ImageGallery pictures={pictures} openModal={this.showModal} />)}
        {imageLink &&(<Modal onClose={this.closeModal}>
          <img src={imageLink} alt={imageLink} />
        </Modal>)}
        {status === 'resolved'&& !lastPictures && (<Button onLoadMore={this.loadMore}/>)}
        <ToastContainer
        position="top-center"/>

      </Container>
    )


  }

};