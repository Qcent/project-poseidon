const searchBarFormHandler = async(event) => {
    const searchString = document.querySelector('#mainSearchInput').value.trim();
    let searchCategory = '';
    if (document.querySelector('#searchCategory')) {
        searchCategory = document.querySelector('#searchCategory').value.trim();
        if (searchCategory === 'All') searchCategory = '';
    }


    if (searchString) {
        document.location.replace(`/${searchCategory}?search=${searchString}`);
        //alert(`/${searchCategory}?search=${searchString}`);
    }
}


if (document.querySelector('#mainSearchBtn'))
    document.querySelector('#mainSearchBtn').addEventListener('click', searchBarFormHandler);
if (document.querySelector('#mainSearchInput'))
    document.querySelector('#mainSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBarFormHandler();
        }
    });