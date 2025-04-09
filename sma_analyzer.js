// sma-analyzer.js - Core SMA calculation logic

class SMAAnalyzer {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      shortTermPeriods: [8, 13, 21, 34],
      longTermPeriods: [55, 89, 144, 233],
      ...options
    };
    
    this.calculateSMAs();
    this.calculateAverages();
  }
  
  calculateSMA(period) {
    const sma = [];
    for (let i = period - 1; i < this.data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += this.data[i - j].close;
      }
      sma.push({
        time: new Date(this.data[i].time),
        value: sum / period
      });
    }
    return sma;
  }
  
  calculateSMAs() {
    this.shortTermSMAs = this.options.shortTermPeriods.map(period => ({
      period,
      values: this.calculateSMA(period)
    }));
    
    this.longTermSMAs = this.options.longTermPeriods.map(period => ({
      period,
      values: this.calculateSMA(period)
    }));
  }
  
  calculateAverages() {
    this.shortTermAverage = [];
    this.longTermAverage = [];
    
    const maxShortTerm = Math.max(...this.options.shortTermPeriods);
    const maxLongTerm = Math.max(...this.options.longTermPeriods);
    const startIdx = Math.max(maxShortTerm, maxLongTerm) - 1;
    
    for (let i = startIdx; i < this.data.length; i++) {
      let shortSum = 0;
      this.shortTermSMAs.forEach(sma => {
        const idx = i - (maxShortTerm - sma.period);
        shortSum += sma.values[idx].value;
      });
      
      let longSum = 0;
      this.longTermSMAs.forEach(sma => {
        const idx = i - (maxLongTerm - sma.period);
        longSum += sma.values[idx].value;
      });
      
      this.shortTermAverage.push({
        time: new Date(this.data[i].time),
        value: shortSum / this.shortTermSMAs.length
      });
      
      this.longTermAverage.push({
        time: new Date(this.data[i].time),
        value: longSum / this.longTermSMAs.length
      });
    }
  }
  
  isUptrend(index) {
    return this.shortTermAverage[index].value > this.longTermAverage[index].value;
  }
  
  getCrossovers() {
    const crossovers = [];
    
    for (let i = 1; i < this.shortTermAverage.length; i++) {
      const prevShort = this.shortTermAverage[i-1].value;
      const prevLong = this.longTermAverage[i-1].value;
      const currShort = this.shortTermAverage[i].value;
      const currLong = this.longTermAverage[i].value;
      
      if (prevShort <= prevLong && currShort > currLong) {
        crossovers.push({
          time: this.shortTermAverage[i].time,
          type: 'bullish',
          message: 'Short-term average crossed above long-term average'
        });
      }
      else if (prevShort >= prevLong && currShort < currLong) {
        crossovers.push({
          time: this.shortTermAverage[i].time,
          type: 'bearish',
          message: 'Short-term average crossed below long-term average'
        });
      }
    }
    
    return crossovers;
  }
}

export default SMAAnalyzer;
