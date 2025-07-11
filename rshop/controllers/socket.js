const pool = require("../db");

function socketinit(io) {
    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        socket.on("join_auction", (roomId) => {
            socket.join(`auction:${roomId}`);
            console.log(`User ${socket.id} joined room auction:${roomId}`);
        });


   socket.on("top_bid", async (payload) => {
    const { roomId } = payload || {};

    if (!roomId) {
        return socket.emit("top_bid_error", "Invalid room ID");
    }

    try {
        const query = "SELECT current_bid FROM auction_items WHERE id = ?";
        const [rows] = await pool.execute(query, [roomId]);

        if (!rows || rows.length === 0) {
            return socket.emit("top_bid_error", "Auction item not found");
        }
        console.log(rows[0])
        socket.emit("top_bid_result", {
            roomId,
            current_bid: rows[0].current_bid
        });
    } catch (err) {
        console.error("Error fetching top bid:", err.message);
        socket.emit("top_bid_error", "Server error");
    }
});


     socket.on("place_bid", async (payload) => {
    try {
        const { roomId, bidAmount, user } = payload || {};
        
        if (!roomId || !bidAmount || !user) {
            console.warn("⚠️ Incomplete bid payload:", payload);
            return socket.emit("error", "Incomplete bid data");
        }

        console.log("📨 Bid received:", roomId, bidAmount, user);

        const [rows] = await pool.execute("SELECT * FROM auction_items WHERE id = ?", [roomId]);
        console.log(rows)
        if (!rows || rows.length === 0) {
            return socket.emit("error", "Room not found");
        }

        const item = rows[0];
        console.log(item.status)
        if (item.status !== "live") {
            return socket.emit("error", "Auction is not live");
        }

       const currentBid = item.current_bid;

if (currentBid === null || currentBid === 0) {
    if (bidAmount <= item.base_price) {
        return socket.emit("error", `Bid must be greater than base price ₹${item.base_price}`);
    }
} else {
    if (bidAmount <= currentBid) {
        return socket.emit("error", `Bid must be higher than current bid ₹${currentBid}`);
    }
}


        await pool.execute(
            "UPDATE auction_items SET current_bid = ?, current_bidder_id = ? WHERE id = ?",
            [bidAmount, user, roomId]
        );

        io.to(`auction:${roomId}`).emit("new_bid", {
            bidAmount,
            user,
            timestamp: new Date()
        });

    } catch (err) {
        console.error("❌ Bid Error:", err.message);
        socket.emit("error", "Server error while processing bid");
    }
});


        socket.on("disconnect", () => {
            console.log("❌ Client disconnected:", socket.id);
        });
    });
}

module.exports = { socketinit };
