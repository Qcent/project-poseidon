const sortByCategoryHandler = async(event) => {
        const searchString = document.querySelector('#mainSearchInput').value.trim();
        let searchCategory = event.target.options[event.target.selectedIndex].text

        if (searchCategory === 'All') searchCategory = '';
        if (searchString) {
            document.location.replace(`/${searchCategory}?search=${searchString}`);
        } else {
            document.location.replace(`/${searchCategory}`);
        }
    }
    (whichCategory = () => {
        let searchCategory = '';
        if (document.querySelector('#searchCategory')) {
            searchCategory = document.querySelector('#searchCategory').value.trim();
            if (searchCategory === 'All') searchCategory = '';

        } else { console.log("no category"); }
        if (searchCategory != '') {
            let list = document.querySelector('#sort-post-category');
            //console.log(list.options)
            Array.from(list.options).forEach((sel, idx) => {
                if (sel.text == searchCategory) {
                    list.selectedIndex = idx;
                }
            });
        }
    })();
if (document.querySelector('#sort-post-category'))
    document.querySelector('#sort-post-category').addEventListener('change', sortByCategoryHandler);