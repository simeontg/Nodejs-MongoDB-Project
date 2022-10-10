function mapErrors(err){
    if(Array.isArray(err)){
        return err;
    }else if (err.name == 'ValidationError'){
        return [{msg: 'Error'}];
    }else if(typeof err.message == 'string'){
        return [{msg: err.message }]
    }else{
        return [{msg: 'Request Error'}]
    }
}

module.exports = mapErrors