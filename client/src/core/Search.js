import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import SearchInput from './SearchInput';

import { list } from './apiCore';
import Card from './Card';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tField: {
    width: 800,
    marginTop: 2,
  },
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));

const Search = () => {
  const [data, setData] = useState({
    search: '',
    results: [],
    searched: false,
  });

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async (search) => {
    setLoading(true);
    if (search) {
      list({ search: search || undefined }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            console.log("response",response);
            if(response.length>1)
            {setOptions(response);}
            else
            {
              setOptions([])
            }
            setLoading(false);
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }else {
          setOptions([]);
          setLoading(false);
          setData({
            search: '',
            results: [],
            searched: false,
          });
      }
      // if (word) {
      //     setLoading(true);
      //     // let response = await getApiSuggestions(word);
      //     // console.log(response);
      //     // setOptions(response);
      //     // setLoading(false);
      // } else {
      //     setOptions([]);
      // }
  };

  const getApiUrl = (name) => {
    handleChange(name);
    // let finalUrl = '/product/'+url;
    // window.open(finalUrl, '_blank');
};

  const { search, results, searched } = data;


  useEffect(() => {
  }, []);

  const searchData = () => {
    // console.log(search, category);
    if (search) {
      list({ search: search || undefined }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `Search: No products found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div className='row'>
        <div className='col-md-1'></div>
        <div className='col-md-10'>
          <h2 className='mt-4 mb-4 text-center'>{searchMessage(searched, results)}</h2>
          <div className='row'>
            {results.map((product, i) => (
              <div className='col-md-4 mb-3'>
                <Card key={i} product={product} />
              </div>
            ))}
          </div>
          {searched && results.length > 0?<hr />:null}
        </div>
        <div className='col-md-1'></div>
      </div>
    );
  };

  const classes = useStyles();

  const searchForm = () => (
    <form onSubmit={searchSubmit} className={classes.root}>
      <span >
        <div className='input-group input-group-lg'>
          {/* <div className='input-group-prepend'>
            <FormControl className={classes.formControl}>
              <InputLabel id='demo-simple-select-helper-label'>
              </InputLabel>
            </FormControl>
          </div> */}
          <SearchInput
            className={classes.tField}
                loading={loading}
                options={options}
                requests={getSuggestions}
                onClickFunction={getApiUrl}
                placeholder="Search the product here..."
            />
           {/* <TextField
            onChange={handleChange('search')}
            id='outlined-basic'
            label={<span><SearchIcon/>Search by name</span>}
            variant='outlined'
            className={classes.tField}
            autoComplete='off'
          />  */}

          {/* <div className='ml-3 mt-2' style={{ border: 'none' }}>
            <Button ml={2} variant='contained' color='primary' type='submit'>
              Search
            </Button>
          </div> */}
        </div>
      </span>
    </form>
  );

  return (
    <div className='row'>
      <div className='container mb-3'>{searchForm()}</div>
      <div className='container-fluid mb-3'>{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
