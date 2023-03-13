import { createAction, handleActions } from 'redux-actions';
// import { Map,fromJS }from 'immutable';

export const SET_SYMBOL = 'trade/SET_SYMBOL'; //심볼 설정
export const SET_EXCHANGE_INFO = 'trade/SET_EXCHANGE_INFO'; //현재 심볼 정보 설정
export const SET_NEW_EXCHANGE_INFO = 'trade/SET_NEW_EXCHANGE_INFO';
export const SET_PREV_SYMBOL = 'trade/SET_PREV_SYMBOL';
export const SET_ORDERBOOK_DEPTH_UNIT = 'trade/SET_ORDERBOOK_DEPTH_UNIT'
export const SET_ORDERBOOK_ROWCOUNT = 'trade/SET_ORDERBOOK_ROWCOUNT';
export const CHANGE_TRADE_TYPE = 'trade/CHANGE_TRADE_TYPE';
export const CHANGE_ORDER_MODE = 'trade/CHANGE_ORDER_MODE';
export const CHANGE_ORDERBOOK_ORDER_VALUE = 'trade/CHANGE_ORDERBOOK_ORDER_VALUE';
export const CHANGE_ORDERBOOK_ORDER_ISREDUCE = 'trade/CHANGE_ORDERBOOK_ORDER_ISREDUCE';
export const SET_SYMBOL_MARK = 'trade/SET_SYMBOL_MARK';

const initialState = {
    symbol: '',
    prevSymbol: '',
    maxlength: 10,
    exchangeInfo: {
        minPrice: '',
        maxPrice: '',
        minQty: '',
        maxQty: '',
        pricePrecision: 0,
        quantityPrecision: 0,
    },
    orderbook: {
        mode: 'dual',
        tradeType: 'off',
        unit: '',
        pricedigit: 0,
        quantityPrecision: 0,
        rowCount: 30,
        value:'',
        sliderValue: '',
        isReduce: false,
    },
    ex: [],
    markLabel:{},
    symbolMax:[]
}

const reducer = {
    [SET_SYMBOL]: (state,action) => ({
        ...state,
        symbol: action.payload
    }),
    [SET_PREV_SYMBOL]: (state) => ({
        ...state,
        prevSymbol: state.symbol
    }),
    [SET_EXCHANGE_INFO]: (state, action) => ({
        ...state,
        exchangeInfo: {
            ...state.exchangeInfo,
            minPrice: action.payload.minPrice,
            maxPrice: action.payload.maxPrice,
            minQty: action.payload.minQty,
            maxQty: action.payload.maxQty,
            pricePrecision: action.payload.pricePrecision,
            quantityPrecision: action.payload.quantityPrecision
        },
        orderbook: {
            ...state.orderbook,
            unit: action.payload.minPrice,
            pricedigit: action.payload.pricePrecision,
            quantityPrecision: action.payload.quantityPrecision,
        },
        ex: action.payload.all
    }),
    [SET_NEW_EXCHANGE_INFO]: (state,action) => ({
        ...state,
        exchangeInfo: {
            ...state.exchangeInfo,
            minPrice: action.payload.minPrice,
            maxPrice: action.payload.maxPrice,
            minQty: action.payload.minQty,
            maxQty: action.payload.maxQty,
            pricePrecision: action.payload.pricePrecision,
            quantityPrecision: action.payload.quantityPrecision
        },
        orderbook:{
            ...state.orderbook,
            mode: 'dual',
            tradeType: 'off',
            unit: action.payload.minPrice,
            pricedigit: action.payload.pricePrecision,
            quantityPrecision: action.payload.quantityPrecision,
            value:'',
            sliderValue: '',
            isReduce: false,
        }
    }),
    [SET_ORDERBOOK_DEPTH_UNIT]: (state,action) => ({
        ...state,
        orderbook:{
            ...state.orderbook,
            unit: action.unit,
            pricedigit: action.digit
        }
    }),
    [SET_ORDERBOOK_ROWCOUNT]: (state,action) => ({
        ...state,
        orderbook: {
            ...state.orderbook,
            rowCount: action.payload
        }
    }),
    [CHANGE_TRADE_TYPE]: (state,action) => ({
        ...state,
        orderbook:{
            ...state.orderbook,
            tradeType: action.payload
        }
    }),
    [CHANGE_ORDER_MODE]: (state,action) => ({
        ...state,
        orderbook:{
            ...state.orderbook,
            mode: action.payload.isSingle
        }
    }),
    [CHANGE_ORDERBOOK_ORDER_VALUE]: (state,action) => ({
        ...state,
        orderbook:{
            ...state.orderbook,
            value: action.payload.value,
            sliderValue: action.payload.slider
        }
    }),
    [CHANGE_ORDERBOOK_ORDER_ISREDUCE]: (state) => ({
        ...state,
        orderbook: {
            ...state.orderbook,
            isReduce: !state.orderbook.isReduce
        }
    }),
    [SET_SYMBOL_MARK]: (state,action) => ({
        ...state,
        markLabel: action.payload.mark,
        symbolMax: action.payload.max
    })
}


export const setSymbol = createAction(SET_SYMBOL);
export const setPrevSymbol = createAction(SET_PREV_SYMBOL);
export const setExhangeInfo = createAction(SET_EXCHANGE_INFO);
export const setOrderbookDepthUnit = createAction(SET_ORDERBOOK_DEPTH_UNIT);
export const setOrderbookRowcount = createAction(SET_ORDERBOOK_ROWCOUNT);
export const changeTradeType = createAction(CHANGE_TRADE_TYPE);
export const changeOrderMode = createAction(CHANGE_ORDER_MODE);
export const changeOrderbookOrderValue = createAction(CHANGE_ORDERBOOK_ORDER_VALUE);
export const changeOrderbookOrderIsreduce = createAction(CHANGE_ORDERBOOK_ORDER_ISREDUCE);
export const setExchangeNewInfo = createAction(SET_NEW_EXCHANGE_INFO);
export const setSymbolMark = createAction(SET_SYMBOL_MARK);


export default handleActions(reducer, initialState);