/**
 * Format Response API yang Konsisten
 */

/**
 * Response sukses
 * @param {Object} res - Express response
 * @param {string} message - Pesan sukses
 * @param {*} data - Data yang dikembalikan
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function sukses(res, message, data = null, statusCode = 200) {
    const response = {
        success: true,
        message: message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

/**
 * Response error
 * @param {Object} res - Express response
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code (default: 400)
 */
function gagal(res, message, statusCode = 400) {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
}

module.exports = { sukses, gagal };
