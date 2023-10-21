import Counter from "../models/counterModel.js"
const getLastCounterValue = async (field) => {
    try {
        if (field) {
            var counter = await Counter.findOne({ field: field });
            if (!counter) {
                var createdCounter = await Counter.create({
                    field,
                    lastValue: 0
                });
                return createdCounter.lastValue;
            } else return counter.lastValue;
        }
    }
    catch (error) {
        console.log(error)
    }
}

export {
    getLastCounterValue
}