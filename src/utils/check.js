exports.isEmpty= function (value){
    if(value === null || value.length === 0){
        return true;
    }
    return false;
}

function isMobileNumber(value){
    if(value === null){
        return false;
    }
    if(/^\d{11}$/.test(value)){
        return true;
    }
    return false;
}