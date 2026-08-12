<script>
    // Automatically replace broken images with your placeholder
    document.addEventListener('error', function(e) {
        if (e.target.tagName.toLowerCase() === 'img') {
            e.target.src = 'https://raw.githubusercontent.com/EBURGG/site/refs/heads/main/placeholders/notfound.png';
        }
    }, true);
</script>
