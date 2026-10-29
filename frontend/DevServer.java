import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;

public class DevServer {
    static String root = ".";
    public static void main(String[] args) throws Exception {
        if (args.length > 0) root = args[0];
        var server = HttpServer.create(new InetSocketAddress(3000), 0);
        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) path = "/index.html";
            File file = new File(root + path);
            if (!file.exists() || file.isDirectory()) {
                file = new File(root + "/index.html"); // SPA fallback
            }
            String mime = switch (path.substring(path.lastIndexOf('.') + 1)) {
                case "html" -> "text/html";
                case "css" -> "text/css";
                case "js" -> "application/javascript";
                case "json" -> "application/json";
                case "png" -> "image/png";
                case "svg" -> "image/svg+xml";
                case "ico" -> "image/x-icon";
                case "woff2" -> "font/woff2";
                default -> "application/octet-stream";
            };
            byte[] bytes = Files.readAllBytes(file.toPath());
            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, bytes.length);
            exchange.getResponseBody().write(bytes);
            exchange.getResponseBody().close();
        });
        server.start();
        System.out.println("CodeRoyale Dev Server running at http://localhost:3000");
    }
}
