function byte_array_from_input(input)
{
    var message = new Array(input.cells.length);

    // For every 8bit cell, examine inputs.
    for (var cell = 0; cell < input.cells.length; cell++) {

        // Initialize value.
        message[cell] = 0;

        // Verify that looks sane.
        if (input.cells[cell].children.length != 8) {
            alert("unexpected cell size while reading input");
        }

        // Set each bit according to checked status.
        for (var bit = 0; bit < 8; bit++) {
            if (input.cells[cell].children[bit].checked == true) {
                message[cell] |= 1 << (7 - bit);
            }
        }
    }

    // For string compatability.
    message.charCodeAt = (function(n) { return this[n]; });

    return message;
};

function input_from_byte_array(input, data)
{
    // For every 8bit cell, examine inputs.
    for (var cell = 0; cell < input.cells.length; cell++) {

        // Verify that looks sane.
        if (input.cells[cell].children.length != 8) {
            alert("unexpected cell size while reading input");
        }

        // Set each bit according to checked status.
        for (var bit = 0; bit < 8; bit++) {
            if (data[cell] & (1 << (7 - bit))) {
                input.cells[cell].children[bit].checked = true;
            }
        }
    }
};

// based on http://www.webtoolkit.info/javascript-sha1.html
function sha1_process_message(msg, callback)
{
    function rotate_left(n,s) {
        var t4 = ( n<<s ) | (n>>>(32-s));
        return t4;
    };
 
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
 
    var msg_len = msg.length;
 
    var word_array = new Array();
    for( i=0; i<msg_len-3; i+=4 ) {
        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
        word_array.push( j );
    }
 
    switch( msg_len % 4 ) {
        case 0:
            i = 0x080000000;
        break;
        case 1:
            i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
        break;
 
        case 2:
            i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
        break;
 
        case 3:
            i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;
        break;
    }
 
    word_array.push( i );
 
    while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
    word_array.push( msg_len>>>29 );
    word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
 
        for( i= 0; i<=19; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
            callback(i, A, B, C, D, E, W[i]);
        }
 
        for( i=20; i<=39; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
            callback(i, A, B, C, D, E, W[i]);
        }
 
        for( i=40; i<=59; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
            callback(i, A, B, C, D, E, W[i]);
        }
 
        for( i=60; i<=79; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
            callback(i, A, B, C, D, E, W[i]);
        }
 
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
 
        break;
    }

    return;
}
