const formatDate = (dateString)=> new Date(dateString).toLocaleDateString('en-IE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
});

export default formatDate;