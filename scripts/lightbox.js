// Initialize the lightbox
function initLightbox() {
    $('.lightbox').on('click', function(e) {
        e.preventDefault();
        var fullImageSrc = $(this).attr('href');

        // Display the lightbox overlay
        var lightboxHtml = `
            <div class="lightbox-overlay">
                <img src="${fullImageSrc}" alt="Full Image" />
                <button class="close-lightbox">Close</button>
            </div>`;
        
        $('body').append(lightboxHtml);

        // Close lightbox functionality
        $('.close-lightbox').on('click', function() {
            $('.lightbox-overlay').remove();
        });

        // Click outside the image to close the lightbox
        $('.lightbox-overlay').on('click', function(e) {
            if (e.target === this) {
                $('.lightbox-overlay').remove();
            }
        });
    });
}