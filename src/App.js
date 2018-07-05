import React, { Component } from 'react';
import axios from 'axios';
import { Box, Section, Hero, Title, Button, Field, Control, Input, Level, Icon } from 'reactbulma'; 

import './App.css'; 

class App extends Component {
  constructor() {
    super();
    const legacyState = JSON.parse(sessionStorage.getItem('converterLegacyState'));
    const defaultValues = {
      amount: 1,
      fromCurrency: "EUR",
      toCurrency: "USD",
      convertedAmount: ""
    };
    this.state = {...defaultValues, ...legacyState};
  }

  componentDidUpdate() {
    sessionStorage.setItem('converterLegacyState', JSON.stringify(this.state));
  }

  handleChangeAmount(e) {
    const amount = e.target.value;
    this.setState({amount});
  }

  handleConvertCurrency(e) {
    e.preventDefault();
    axios({
      method: 'get',
      url: 'https://data.fixer.io/api/latest?access_key=a22225565c9b3d18d2ebb3694ef5f6e4',
      params: {
        base: this.state.fromCurrency,
        symbols: this.state.toCurrency
      }   
    }).then((response)=>{
      let rate = response.data.rates[this.state.toCurrency];
      if(typeof(rate) !== 'number')
        rate = 1;
      this.setState({convertedAmount: this.getConvertedAmount(rate)});
    }).catch((error)=>{
      this.setState({convertedAmount: 'Error obtaining data, please try again.'});
      console.log(error);
    });
  }

  getConvertedAmount(rate){
    if(!isNaN(this.state.amount)){
      return (rate * (+this.state.amount)).toFixed(2);
    } else {
      return "The amount entered should be a numeric value";
    }
  }

  render() {
    return (
        <Section>
          <Hero primary bold>
            <Hero.Body>
              <Title>Simple Currency Converter</Title>
              <Level>
                <Level.Left>
                  <Level.Item>
                    <Field hasAddons>
                      <Control>
                        <Input onChange={this.handleChangeAmount.bind(this)} value={this.state.amount} />
                      </Control>
                      <Control>
                        <CurrencySelect changeCurrency={this.setState.bind(this)} statusLabel="fromCurrency" value={this.state.fromCurrency} />
                      </Control>
                    </Field>
                  </Level.Item>
                  <Level.Item>
                    →
                  </Level.Item>
                  <Level.Item>
                    <CurrencySelect changeCurrency={this.setState.bind(this)} statusLabel="toCurrency" value={this.state.toCurrency} />
                  </Level.Item>
                  <Level.Item>
                    <Button primary inverted onClick={this.handleConvertCurrency.bind(this)}>
                      <Icon small>
                            <i className="fa fa-check"/>
                          </Icon>
                          <span>Convert</span>
                    </Button>
                  </Level.Item>
                </Level.Left>
              </Level>
              <Box>{this.state.convertedAmount}</Box>
            </Hero.Body>
          </Hero>
        </Section>
    );
  }
}

class CurrencySelect extends Component {
  constructor() {
    super();
    const currencies = ['EUR', 'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR'];
    this.listCurrencies = currencies.map((currency) => 
      <option key={currency} value={currency}>{currency}</option>
    );
  }
  handleChange(e) {
    const value = e.target.value;
    const newStatus = {};
    newStatus[this.props.statusLabel] = value;

    this.props.changeCurrency(newStatus)
  }
  render() {
    return (
        <select className="select" value={this.props.value} onChange={this.handleChange.bind(this)}>
          {this.listCurrencies}
        </select>
    );
  }
}

export default App;
