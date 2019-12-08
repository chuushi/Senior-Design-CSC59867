module.exports = {
    rate: 41000,
    /* Frequencies to play or listen for. For each index:
     *   0: stand still
     *   1: forward
     *   2: forward-left
     *   3: forward-right
     *   4: reverse
     *   5: reverse-left
     *   6: reverse-right
     */
    freqs: [20500, 20350, 20200, 20050, 19900, 19750, 19600],
    // Decimal points of power to keep. Same index as above.
    sigs: [5, 5, 5, 5, 5, 5, 5],
    showDebug: true,
    webPort: 8080
};
