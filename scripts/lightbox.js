// Initialize the lightbox
function initLightbox() {
    $('.lightbox').on('click', function(e) {
        e.preventDefault();
        var fullImageSrc = $(this).attr('href');

        // Display the lightbox overlay
        var lightboxHtml = `
            <div class="lightbox-overlay">
                <img src="${fullImageSrc}" alt="Full Image" class="lightbox-content" />
                <img src="/img/close.png" alt="Close" class="close-lightbox" />
            </div>`;
        
        $('body').append(lightboxHtml);

        // Close lightbox functionality when clicking the close image
        $('.close-lightbox').on('click', function() {
            $('.lightbox-overlay').remove();
        });

        // Click outside the content to close the lightbox
        $('.lightbox-overlay').on('click', function(e) {
            if ($(e.target).hasClass('lightbox-overlay')) {
                $('.lightbox-overlay').remove();
            }
        });
    });
}