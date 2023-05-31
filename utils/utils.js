const createTransaction = ({userId, description, amount = 0, transType}) => {
    const currentDate = new Date();
    const newTransaction = {
        userId,
        date : currentDate.toISOString(),
        description,
        amount,
        transType
    }
    return newTransaction
}

module.exports = {
    createTransaction
}