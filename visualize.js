
var M1_sha1_state = new Array();
var M2_sha1_state = new Array();

// This is my best result so far.
// -- taviso.
var best_known_M1 = [
  0x7f, 0x45, 0x4c, 0x46, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x25, 0x02, 0x00, 0x03, 0x00, 0x1a, 0x00, 0x49, 0x25,
  0x1a, 0x00, 0x49, 0x25, 0x04, 0x00, 0x00, 0x00, 0xeb, 0x1e, 0x90, 0x90,
  0x03, 0x44, 0xad, 0xa9, 0x5b, 0xef, 0x20, 0x00, 0x01, 0x00, 0xf7, 0x69,
  0x04, 0x37, 0x9e, 0x5c, 0x27, 0x0b, 0xcb, 0x1c, 0x96, 0x35, 0x39, 0x62,
  0xfd, 0x24, 0xca, 0x5d
];
var best_known_M2 = [
  0x7f, 0x45, 0x4c, 0x46, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x49, 0x25, 0x02, 0x00, 0x03, 0x00, 0x1a, 0x00, 0x49, 0x25,
  0x1a, 0x00, 0x49, 0x25, 0x04, 0x00, 0x00, 0x00, 0xeb, 0x1e, 0x90, 0x90,
  0xf4, 0xf4, 0xf4, 0xf4, 0xf4, 0xf4, 0x20, 0x00, 0x01, 0x00, 0xf4, 0xf4,
  0xf4, 0xf4, 0xf4, 0xf4, 0xf4, 0xf4, 0xf4, 0xf4, 0x0b, 0xe5, 0xad, 0x9c,
  0x59, 0x92, 0x22, 0x50
];

function popcount(n) {
    n >>>= 0
    for(var popcnt = 0; n; n &= n - 1) {
        popcnt++;
    }
    return popcnt;
}

function hamming_distance(x, y)
{
    return popcount(x ^ y);
}

function process_waterfall()
{
    for (var R = 0; R < 80; R++) {
        var round       = document.getElementById("R_" + R);
        var regA        = round.cells[1].children[0].rows[0].cells;
        var regB        = round.cells[2].children[0].rows[0].cells;
        var regC        = round.cells[3].children[0].rows[0].cells;
        var regD        = round.cells[4].children[0].rows[0].cells;
        var regE        = round.cells[5].children[0].rows[0].cells;
        var regWt       = round.cells[6].children[0].rows[0].cells;

        // Calculate hamming distance (Wt ignored)
        var hd = hamming_distance(M1_sha1_state[R].A, M2_sha1_state[R].A)
               + hamming_distance(M1_sha1_state[R].B, M2_sha1_state[R].B) 
               + hamming_distance(M1_sha1_state[R].C, M2_sha1_state[R].C) 
               + hamming_distance(M1_sha1_state[R].D, M2_sha1_state[R].D) 
               + hamming_distance(M1_sha1_state[R].E, M2_sha1_state[R].E);

        switch (true) {
            case (hd >= 0  && hd < 32):
                round.bgColor = "#0f0";
                break;
            case (hd >= 32 && hd < 64):
                round.bgColor = "#fb0"
                break;
            case (hd >= 64):
                round.bgColor = "#f00"
                break;
        }

        for (var i = 0; i < 32; i++) {
            if ((M1_sha1_state[R].A & (1 << i)) && (M2_sha1_state[R].A & (1 << i))) {
                // Bit is set in both states
                regA[i].bgColor = "#000";
            } else if (!(M1_sha1_state[R].A & (1 << i)) && !(M2_sha1_state[R].A & (1 << i))) {
                // Bit is set in neither states
                regA[i].bgColor = "#fff";
            } else {
                // Bit is set in one state
                regA[i].bgColor = "#00f";
            }
            if ((M1_sha1_state[R].B & (1 << i)) && (M2_sha1_state[R].B & (1 << i))) {
                // Bit is set in both states
                regB[i].bgColor = "#000";
            } else if (!(M1_sha1_state[R].B & (1 << i)) && !(M2_sha1_state[R].B & (1 << i))) {
                // Bit is set in neither states
                regB[i].bgColor = "#fff";
            } else {
                // Bit is set in one state
                regB[i].bgColor = "#00f";
            }
            if ((M1_sha1_state[R].C & (1 << i)) && (M2_sha1_state[R].C & (1 << i))) {
                // Bit is set in both states
                regC[i].bgColor = "#000";
            } else if (!(M1_sha1_state[R].C & (1 << i)) && !(M2_sha1_state[R].C & (1 << i))) {
                // Bit is set in neither states
                regC[i].bgColor = "#fff";
            } else {
                // Bit is set in one state
                regC[i].bgColor = "#00f";
            }
            if ((M1_sha1_state[R].D & (1 << i)) && (M2_sha1_state[R].D & (1 << i))) {
                // Bit is set in both states
                regD[i].bgColor = "#000";
            } else if (!(M1_sha1_state[R].D & (1 << i)) && !(M2_sha1_state[R].D & (1 << i))) {
                // Bit is set in neither states
                regD[i].bgColor = "#fff";
            } else {
                // Bit is set in one state
                regD[i].bgColor = "#00f";
            }
            if ((M1_sha1_state[R].E & (1 << i)) && (M2_sha1_state[R].E & (1 << i))) {
                // Bit is set in both states
                regE[i].bgColor = "#000";
            } else if (!(M1_sha1_state[R].E & (1 << i)) && !(M2_sha1_state[R].E & (1 << i))) {
                // Bit is set in neither states
                regE[i].bgColor = "#fff";
            } else {
                // Bit is set in one state
                regE[i].bgColor = "#00f";
            }
            if ((M1_sha1_state[R].Wt & (1 << i)) && (M2_sha1_state[R].Wt & (1 << i))) {
                // Bit is set in both states
                regWt[i].bgColor = "#000";
            } else if (!(M1_sha1_state[R].Wt & (1 << i)) && !(M2_sha1_state[R].Wt & (1 << i))) {
                // Bit is set in neither states
                regWt[i].bgColor = "#fff";
            } else {
                // Bit is set in one state
                regWt[i].bgColor = "#00f";
            }
        }
    }
}

function reset_waterfall()
{
}

function process_input_vectors()
{
    var M1 = byte_array_from_input(document.getElementById('M1'));
    var M2 = byte_array_from_input(document.getElementById('M2'));

    reset_waterfall();
    sha1_process_message(M1, (function(R, A, B, C, D, E, Wt){ M1_sha1_state[R] = { "A" : A, "B" : B, "C" : C, "D" : D, "E" : E, "Wt" : Wt } }));
    sha1_process_message(M2, (function(R, A, B, C, D, E, Wt){ M2_sha1_state[R] = { "A" : A, "B" : B, "C" : C, "D" : D, "E" : E, "Wt" : Wt } }));
    process_waterfall();
}

function create_state_table()
{
    var state = document.getElementById('sha1_internal_state');

    for (var i = 2; i < 81; i++) {
        var row = state.insertRow(i);
        row.innerHTML = state.rows[i - 1].innerHTML;
        row.cells[0].innerHTML = i - 1;
        row.id = "R_" + (i - 1);
    }
};

function create_input_checkboxes()
{
    var M1 = document.getElementById('M1');
    var M2 = document.getElementById('M2');

    for (var i = 1; i < 64; i++) {
        var cell1 = M1.insertCell(i);
        var cell2 = M2.insertCell(i);

        cell1.innerHTML = M1.cells[i - 1].innerHTML;
        cell2.innerHTML = M2.cells[i - 1].innerHTML;
    }
};

$(function init()
{
    create_state_table();
    create_input_checkboxes();

    if (document.location.search == "?best=1") {
        input_from_byte_array(document.getElementById('M1'), best_known_M1);
        input_from_byte_array(document.getElementById('M2'), best_known_M2);
    }
    
    process_input_vectors();
    
    // Inject a spacing div
    var spacing = $("#messages").clone().attr("id", "messages-spacing");
    $("#messages").after(spacing);
});
